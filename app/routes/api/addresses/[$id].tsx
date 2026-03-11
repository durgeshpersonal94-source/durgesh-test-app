import { json, type LoaderFunction, type ActionFunction } from '@remix-run/node';
import { authenticate } from '~/shopify.server';
import { getAddress, updateAddress, deleteAddress, setDefaultAddress, type AddressInput } from '~/services/addressMongo.server';

/**
 * GET /api/addresses/:id?customerId=xxx
 * Fetch a single address
 */
export const loader: LoaderFunction = async ({ request, params }) => {
  if (request.method !== 'GET') {
    return json({ success: false, message: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { id } = params;

    if (!id) {
      return json(
        {
          success: false,
          message: 'Address ID is required',
          error: 'Missing address ID in URL',
        },
        { status: 400 }
      );
    }

    // Fetch single address
    const result = await getAddress(id);

    return json(result, { status: result.success ? 200 : 400 });
  } catch (error: any) {
    console.error('Loader error:', error);
    return json(
      {
        success: false,
        message: 'Internal server error',
        error: error.message,
      },
      { status: 500 }
    );
  }
};

/**
 * PATCH /api/addresses/:id
 * Update an address
 *
 * DELETE /api/addresses/:id
 * Delete an address
 *
 * POST /api/addresses/:id?action=setDefault&customerId=xxx
 * Set address as default
 */
export const action: ActionFunction = async ({ request, params }) => {
  try {
    // Authenticate with Shopify
    const { admin } = await authenticate.admin(request);

    const { id } = params;

    if (!id) {
      return json(
        {
          success: false,
          message: 'Address ID is required',
          error: 'Missing address ID in URL',
        },
        { status: 400 }
      );
    }

    // Handle PATCH (Update)
    if (request.method === 'PATCH') {
      let updateData: Partial<AddressInput>;
      try {
        updateData = await request.json();
      } catch (error) {
        return json(
          {
            success: false,
            message: 'Invalid JSON in request body',
            error: 'Failed to parse JSON',
          },
          { status: 400 }
        );
      }

      // Validate customerId for authorization
      if (!updateData.customerId) {
        return json(
          {
            success: false,
            message: 'Customer ID is required for verification',
            error: 'Missing customerId',
          },
          { status: 400 }
        );
      }

      const result = await updateAddress(id, updateData);

      return json(result, { status: result.success ? 200 : 400 });
    }

    // Handle DELETE
    if (request.method === 'DELETE') {
      // Get customerId from query params for verification
      const url = new URL(request.url);
      const customerId = url.searchParams.get('customerId');

      if (!customerId) {
        return json(
          {
            success: false,
            message: 'Customer ID is required for verification',
            error: 'Missing customerId query parameter',
          },
          { status: 400 }
        );
      }

      // Verify the address belongs to this customer before deleting
      const addressCheck = await getAddress(id);
      if (addressCheck.success && addressCheck.data) {
        const addressData = addressCheck.data as any;
        if (addressData.customerId !== customerId) {
          return json(
            {
              success: false,
              message: 'Address does not belong to this customer',
              error: 'Authorization failed',
            },
            { status: 403 }
          );
        }
      }

      const result = await deleteAddress(id);

      return json(result, { status: result.success ? 200 : 400 });
    }

    // Handle POST (Set Default)
    if (request.method === 'POST') {
      const url = new URL(request.url);
      const action = url.searchParams.get('action');
      const customerId = url.searchParams.get('customerId');

      if (action === 'setDefault') {
        if (!customerId) {
          return json(
            {
              success: false,
              message: 'Customer ID is required',
              error: 'Missing customerId query parameter',
            },
            { status: 400 }
          );
        }

        const result = await setDefaultAddress(customerId, id);

        return json(result, { status: result.success ? 200 : 400 });
      }

      return json(
        {
          success: false,
          message: 'Invalid action',
          error: 'Unknown POST action',
        },
        { status: 400 }
      );
    }

    return json({ success: false, message: 'Method not allowed' }, { status: 405 });
  } catch (error: any) {
    console.error('Action error:', error);

    // Handle Shopify auth errors
    if (error.status === 401) {
      return json(
        {
          success: false,
          message: 'Unauthorized',
          error: 'Authentication failed',
        },
        { status: 401 }
      );
    }

    return json(
      {
        success: false,
        message: 'Internal server error',
        error: error.message,
      },
      { status: 500 }
    );
  }
};
