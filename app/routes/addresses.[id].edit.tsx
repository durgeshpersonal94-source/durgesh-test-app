import { json, type ActionFunction, type LoaderFunction } from '@remix-run/node';
import { Form, useLoaderData, useActionData, redirect } from '@remix-run/react';

interface Address {
  _id: string;
  customerId: string;
  first_name: string;
  last_name: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LoaderData {
  address: Address;
}

interface ActionData {
  success?: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string>;
}

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;

  if (!id) {
    throw new Response('Address ID is required', { status: 400 });
  }

  try {
    const response = await fetch(`http://localhost:8001/api/addresses/address/${id}`);
    const data = await response.json();

    if (data.success) {
      return json<LoaderData>({
        address: data.data,
      });
    }

    throw new Response('Address not found', { status: 404 });
  } catch (error) {
    throw new Response('Failed to load address', { status: 500 });
  }
};

export const action: ActionFunction = async ({ request, params }) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  const { id } = params;

  if (!id) {
    return json({ error: 'Address ID is required' }, { status: 400 });
  }

  const formData = await request.formData();

  const addressData = {
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    address1: formData.get('address1'),
    address2: formData.get('address2') || '',
    city: formData.get('city'),
    province: formData.get('province'),
    country: formData.get('country'),
    zip: formData.get('zip'),
    phone: formData.get('phone') || '',
    isDefault: formData.get('isDefault') === 'on',
  };

  try {
    const response = await fetch(`http://localhost:8001/api/addresses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addressData),
    });

    const data = await response.json();

    if (data.success) {
      return redirect('/addresses');
    }

    return json<ActionData>({
      error: data.message,
      errors: data.errors,
    });
  } catch (error) {
    return json<ActionData>({
      error: 'Failed to update address. Make sure the server is running.',
    });
  }
};

export default function EditAddressPage() {
  const { address } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Edit Address</h1>
        <a href="/addresses" style={styles.backLink}>
          ← Back to Addresses
        </a>
      </div>

      {actionData?.error && (
        <div style={styles.alert.error}>
          <p>{actionData.error}</p>
          {actionData.errors && (
            <ul style={styles.errorsList}>
              {Object.entries(actionData.errors).map(([field, msg]) => (
                <li key={field}>
                  <strong>{field}:</strong> {msg}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <Form method="post" style={styles.form}>
        <div style={styles.formGrid}>
          {/* First Name */}
          <div style={styles.formGroup}>
            <label htmlFor="first_name">First Name *</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              defaultValue={address.first_name}
              required
              style={styles.input}
            />
          </div>

          {/* Last Name */}
          <div style={styles.formGroup}>
            <label htmlFor="last_name">Last Name *</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              defaultValue={address.last_name}
              required
              style={styles.input}
            />
          </div>

          {/* Address 1 */}
          <div style={styles.fullWidth}>
            <label htmlFor="address1">Street Address *</label>
            <input
              type="text"
              id="address1"
              name="address1"
              defaultValue={address.address1}
              required
              style={styles.input}
            />
          </div>

          {/* Address 2 */}
          <div style={styles.fullWidth}>
            <label htmlFor="address2">Apt, Suite, or Building (Optional)</label>
            <input
              type="text"
              id="address2"
              name="address2"
              defaultValue={address.address2 || ''}
              style={styles.input}
            />
          </div>

          {/* City */}
          <div style={styles.formGroup}>
            <label htmlFor="city">City *</label>
            <input
              type="text"
              id="city"
              name="city"
              defaultValue={address.city}
              required
              style={styles.input}
            />
          </div>

          {/* Province */}
          <div style={styles.formGroup}>
            <label htmlFor="province">State/Province *</label>
            <input
              type="text"
              id="province"
              name="province"
              defaultValue={address.province}
              required
              style={styles.input}
            />
          </div>

          {/* Country */}
          <div style={styles.formGroup}>
            <label htmlFor="country">Country *</label>
            <input
              type="text"
              id="country"
              name="country"
              defaultValue={address.country}
              required
              style={styles.input}
            />
          </div>

          {/* ZIP Code */}
          <div style={styles.formGroup}>
            <label htmlFor="zip">ZIP Code *</label>
            <input
              type="text"
              id="zip"
              name="zip"
              defaultValue={address.zip}
              required
              style={styles.input}
            />
          </div>

          {/* Phone */}
          <div style={styles.fullWidth}>
            <label htmlFor="phone">Phone (Optional)</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              defaultValue={address.phone || ''}
              style={styles.input}
            />
          </div>

          {/* Set as Default */}
          <div style={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              defaultChecked={address.isDefault}
              style={styles.checkbox}
            />
            <label htmlFor="isDefault" style={styles.checkboxLabel}>
              Set as default address for this customer
            </label>
          </div>
        </div>

        <div style={styles.infoBox}>
          <p>
            <strong>Address ID:</strong> {address._id}
          </p>
          <p>
            <strong>Created:</strong> {new Date(address.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Last Updated:</strong> {new Date(address.updatedAt).toLocaleString()}
          </p>
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.submitButton}>
            Update Address
          </button>
          <a href="/addresses" style={styles.cancelButton}>
            Cancel
          </a>
        </div>
      </Form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  backLink: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontSize: '14px',
  },
  alert: {
    error: {
      padding: '16px',
      marginBottom: '20px',
      backgroundColor: '#fef2f2',
      borderLeft: '4px solid #ef4444',
      color: '#991b1b',
      borderRadius: '4px',
    },
  },
  errorsList: {
    marginTop: '8px',
    paddingLeft: '20px',
    fontSize: '13px',
  },
  form: {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '24px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  fullWidth: {
    gridColumn: '1 / -1',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  input: {
    padding: '10px 12px',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    fontFamily: 'inherit',
    marginTop: '4px',
  },
  checkboxGroup: {
    gridColumn: '1 / -1',
    display: 'flex',
    alignItems: 'center',
    marginTop: '8px',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    marginRight: '8px',
    cursor: 'pointer',
  },
  checkboxLabel: {
    fontSize: '14px',
    cursor: 'pointer',
  },
  infoBox: {
    backgroundColor: '#f0fdf4',
    borderLeft: '4px solid #22c55e',
    padding: '12px',
    marginBottom: '20px',
    borderRadius: '4px',
    fontSize: '13px',
    color: '#166534',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
  },
  submitButton: {
    flex: 1,
    padding: '12px 16px',
    backgroundColor: '#008060',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  cancelButton: {
    flex: 1,
    padding: '12px 16px',
    backgroundColor: '#e5e7eb',
    color: '#374151',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center' as const,
  },
};
