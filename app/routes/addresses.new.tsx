import { json, type ActionFunction, type LoaderFunction } from '@remix-run/node';
import { Form, useActionData, redirect } from '@remix-run/react';
import { useState } from 'react';

interface ActionData {
  success?: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string>;
}

export const loader: LoaderFunction = async () => {
  return json({
    customerId: 'gid://shopify/Customer/123456789', // In real app, from session
  });
};

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  const formData = await request.formData();

  const addressData = {
    customerId: formData.get('customerId'),
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
    const response = await fetch('http://localhost:8001/api/addresses', {
      method: 'POST',
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
      error: 'Failed to create address. Make sure the server is running.',
    });
  }
};

export default function NewAddressPage() {
  const actionData = useActionData<ActionData>();
  const [showErrors, setShowErrors] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Add New Address</h1>
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
          {/* Customer ID (hidden) */}
          <input type="hidden" name="customerId" value="gid://shopify/Customer/123456789" />

          {/* First Name */}
          <div style={styles.formGroup}>
            <label htmlFor="first_name">First Name *</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              placeholder="John"
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
              placeholder="Doe"
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
              placeholder="123 Main Street"
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
              placeholder="Apt 4B"
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
              placeholder="New York"
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
              placeholder="NY"
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
              placeholder="United States"
              defaultValue="United States"
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
              placeholder="10001"
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
              placeholder="+1-212-555-0123"
              style={styles.input}
            />
          </div>

          {/* Set as Default */}
          <div style={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              style={styles.checkbox}
            />
            <label htmlFor="isDefault" style={styles.checkboxLabel}>
              Set as default address for this customer
            </label>
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.submitButton}>
            Create Address
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
