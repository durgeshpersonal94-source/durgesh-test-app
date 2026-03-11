import { json, type LoaderFunction, type ActionFunction } from '@remix-run/node';
import { useLoaderData, Form, useActionData, redirect } from '@remix-run/react';
import { useState, useEffect } from 'react';

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
  addresses: Address[];
  customerId: string;
}

// Loader: Fetch all addresses for the customer
export const loader: LoaderFunction = async ({ request }) => {
  // In a real app, get customerId from Shopify session
  const customerId = 'gid://shopify/Customer/123456789';

  try {
    const response = await fetch(
      `http://localhost:8001/api/addresses/${customerId}`
    );
    const data = await response.json();

    if (data.success) {
      return json<LoaderData>({
        addresses: data.data || [],
        customerId,
      });
    }

    return json<LoaderData>({
      addresses: [],
      customerId,
    });
  } catch (error) {
    console.error('Failed to fetch addresses:', error);
    return json<LoaderData>({
      addresses: [],
      customerId,
    });
  }
};

// Action: Handle delete address
export const action: ActionFunction = async ({ request }) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  const formData = await request.formData();
  const actionType = formData.get('_action');
  const addressId = formData.get('addressId');

  if (actionType === 'delete' && addressId) {
    try {
      const response = await fetch(
        `http://localhost:8001/api/addresses/${addressId}`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();

      if (data.success) {
        return redirect('/addresses');
      }

      return json({ error: data.message || 'Failed to delete address' });
    } catch (error) {
      return json({ error: 'Error deleting address' });
    }
  }

  return json({ error: 'Invalid action' });
};

export default function AddressesPage() {
  const { addresses, customerId } = useLoaderData<LoaderData>();
  const actionData = useActionData<typeof action>();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Manage Addresses</h1>
        <a href="/addresses/new" style={styles.addButton}>
          + Add New Address
        </a>
      </div>

      {actionData?.error && (
        <div style={styles.alert.error}>{actionData.error}</div>
      )}

      {addresses.length === 0 ? (
        <div style={styles.noData}>
          <p>No addresses found. Create your first address.</p>
          <a href="/addresses/new" style={styles.button}>
            Add Address
          </a>
        </div>
      ) : (
        <div style={styles.addressGrid}>
          {addresses.map((address) => (
            <div key={address._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3>
                  {address.first_name} {address.last_name}
                </h3>
                {address.isDefault && (
                  <span style={styles.badge}>Default</span>
                )}
              </div>

              <div style={styles.addressDetails}>
                <p>
                  <strong>Address:</strong> {address.address1}
                </p>
                {address.address2 && (
                  <p>
                    <strong>Suite:</strong> {address.address2}
                  </p>
                )}
                <p>
                  <strong>City:</strong> {address.city}, {address.province}{' '}
                  {address.zip}
                </p>
                <p>
                  <strong>Country:</strong> {address.country}
                </p>
                {address.phone && (
                  <p>
                    <strong>Phone:</strong> {address.phone}
                  </p>
                )}
              </div>

              <div style={styles.cardFooter}>
                <small>
                  Created: {new Date(address.createdAt).toLocaleDateString()}
                </small>
              </div>

              <div style={styles.actions}>
                <a
                  href={`/addresses/${address._id}/edit`}
                  style={styles.editButton}
                >
                  Edit
                </a>

                <button
                  onClick={() => setDeleteConfirm(address._id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>

                {!address.isDefault && (
                  <a
                    href={`/addresses/${address._id}/setDefault`}
                    style={styles.defaultButton}
                  >
                    Set Default
                  </a>
                )}
              </div>

              {deleteConfirm === address._id && (
                <div style={styles.confirmDelete}>
                  <p>Are you sure you want to delete this address?</p>
                  <Form method="post" style={styles.confirmForm}>
                    <input type="hidden" name="_action" value="delete" />
                    <input type="hidden" name="addressId" value={address._id} />
                    <button type="submit" style={styles.confirmButton}>
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(null)}
                      style={styles.cancelButton}
                    >
                      Cancel
                    </button>
                  </Form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
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
  addButton: {
    backgroundColor: '#008060',
    color: 'white',
    padding: '10px 16px',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: '500',
    cursor: 'pointer',
    fontSize: '14px',
  },
  alert: {
    error: {
      padding: '12px 16px',
      marginBottom: '20px',
      backgroundColor: '#fef2f2',
      borderLeft: '4px solid #ef4444',
      color: '#991b1b',
      borderRadius: '4px',
      fontSize: '14px',
    },
  },
  noData: {
    textAlign: 'center' as const,
    padding: '40px 20px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  button: {
    display: 'inline-block',
    marginTop: '16px',
    backgroundColor: '#008060',
    color: 'white',
    padding: '10px 16px',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: '500',
  },
  addressGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },
  card: {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  badge: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  addressDetails: {
    color: '#374151',
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '12px',
  },
  cardFooter: {
    borderTop: '1px solid #f3f4f6',
    paddingTop: '12px',
    marginBottom: '12px',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  editButton: {
    flex: 1,
    minWidth: '80px',
    padding: '8px 12px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center' as const,
  },
  deleteButton: {
    flex: 1,
    minWidth: '80px',
    padding: '8px 12px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  defaultButton: {
    flex: 1,
    minWidth: '100px',
    padding: '8px 12px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center' as const,
  },
  confirmDelete: {
    marginTop: '12px',
    padding: '12px',
    backgroundColor: '#fef2f2',
    borderLeft: '4px solid #ef4444',
    borderRadius: '4px',
  },
  confirmForm: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  },
  confirmButton: {
    flex: 1,
    padding: '8px 12px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  cancelButton: {
    flex: 1,
    padding: '8px 12px',
    backgroundColor: '#e5e7eb',
    color: '#374151',
    border: 'none',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  },
};
