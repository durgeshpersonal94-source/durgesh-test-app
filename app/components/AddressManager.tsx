/**
 * Address Manager Component
 * Frontend React component for managing customer addresses
 * Integrates with Express API: http://localhost:8000/api/addresses
 */

import { useEffect, useState } from 'react';

const AddressManager = ({ customerId }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    country: 'United States',
    zip: '',
    phone: '',
    isDefault: false,
  });

  const API_URL = 'http://localhost:8000/api/addresses';

  /**
   * Fetch all addresses for the customer
   */
  const fetchAddresses = async () => {
    if (!customerId) {
      setError('Customer ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/${customerId}`);
      const data = await response.json();

      if (data.success) {
        setAddresses(data.data);
        setSuccess('Addresses loaded successfully');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message || 'Failed to load addresses');
      }
    } catch (err) {
      setError(`Error loading addresses: ${err.message}`);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load addresses on component mount or when customerId changes
   */
  useEffect(() => {
    if (customerId) {
      fetchAddresses();
    }
  }, [customerId]);

  /**
   * Handle form input changes
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  /**
   * Handle form submission (create or update)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // For update, prepend customerId to form data
      const payload = {
        ...formData,
        ...(editingId ? {} : { customerId }),
      };

      const options = {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      };

      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const response = await fetch(url, options);
      const data = await response.json();

      if (data.success) {
        setSuccess(
          editingId
            ? 'Address updated successfully!'
            : 'Address created successfully!'
        );
        resetForm();
        await fetchAddresses();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message || 'Failed to save address');
        if (data.errors) {
          // Show field-specific errors
          const errorMessages = Object.values(data.errors)
            .flat()
            .join(', ');
          setError(`${data.message}: ${errorMessages}`);
        }
      }
    } catch (err) {
      setError(`Error saving address: ${err.message}`);
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Edit an address
   */
  const handleEdit = (address) => {
    setFormData({
      first_name: address.first_name,
      last_name: address.last_name,
      address1: address.address1,
      address2: address.address2 || '',
      city: address.city,
      province: address.province,
      country: address.country,
      zip: address.zip,
      phone: address.phone || '',
      isDefault: address.isDefault,
    });
    setEditingId(address._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Delete an address
   */
  const handleDelete = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/${addressId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        setSuccess('Address deleted successfully!');
        await fetchAddresses();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message || 'Failed to delete address');
      }
    } catch (err) {
      setError(`Error deleting address: ${err.message}`);
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Set as default address
   */
  const handleSetDefault = async (addressId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_URL}/${customerId}/${addressId}/setDefault`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        setSuccess('Default address updated!');
        await fetchAddresses();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message || 'Failed to set default address');
      }
    } catch (err) {
      setError(`Error setting default: ${err.message}`);
      console.error('Set default error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      address1: '',
      address2: '',
      city: '',
      province: '',
      country: 'United States',
      zip: '',
      phone: '',
      isDefault: false,
    });
    setEditingId(null);
  };

  return (
    <div className="address-manager" style={styles.container}>
      <h1>Address Management</h1>

      {/* Alert Messages */}
      {error && <div style={styles.alert.error}>{error}</div>}
      {success && <div style={styles.alert.success}>{success}</div>}

      {/* Address Form */}
      <div style={styles.formSection}>
        <h2>{editingId ? 'Edit Address' : 'Add New Address'}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label htmlFor="first_name">First Name *</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="John"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="last_name">Last Name *</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Doe"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="address1">Street Address *</label>
              <input
                type="text"
                id="address1"
                name="address1"
                value={formData.address1}
                onChange={handleInputChange}
                placeholder="123 Main Street"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="address2">Apt/Suite (Optional)</label>
              <input
                type="text"
                id="address2"
                name="address2"
                value={formData.address2}
                onChange={handleInputChange}
                placeholder="Apt 4B"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="New York"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="province">State/Province *</label>
              <input
                type="text"
                id="province"
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                placeholder="NY"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="country">Country *</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="United States"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="zip">ZIP Code *</label>
              <input
                type="text"
                id="zip"
                name="zip"
                value={formData.zip}
                onChange={handleInputChange}
                placeholder="10001"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="phone">Phone Number (Optional)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1-212-555-0123"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label>
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  style={styles.checkbox}
                />
                Set as default address
              </label>
            </div>
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                ...styles.primaryButton,
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Saving...' : editingId ? 'Update Address' : 'Add Address'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                style={{ ...styles.button, ...styles.secondaryButton }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Addresses List */}
      <div style={styles.listSection}>
        <h2>Your Addresses</h2>

        {loading && !addresses.length ? (
          <p style={styles.loading}>Loading addresses...</p>
        ) : addresses.length === 0 ? (
          <p style={styles.noData}>No addresses found. Add your first address above.</p>
        ) : (
          <div style={styles.addressList}>
            {addresses.map((address) => (
              <div key={address._id} style={styles.addressCard}>
                <div style={styles.cardHeader}>
                  <h3>
                    {address.first_name} {address.last_name}
                    {address.isDefault && (
                      <span style={styles.badge}>Default</span>
                    )}
                  </h3>
                </div>

                <div style={styles.addressInfo}>
                  <p>{address.address1}</p>
                  {address.address2 && <p>{address.address2}</p>}
                  <p>
                    {address.city}, {address.province} {address.zip}
                  </p>
                  <p>{address.country}</p>
                  {address.phone && <p>Phone: {address.phone}</p>}
                </div>

                <div style={styles.cardFooter}>
                  <small style={styles.timestamp}>
                    Created: {new Date(address.createdAt).toLocaleDateString()}
                  </small>
                </div>

                <div style={styles.actionButtons}>
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address._id)}
                      disabled={loading}
                      style={styles.actionButton}
                    >
                      Set as Default
                    </button>
                  )}

                  <button
                    onClick={() => handleEdit(address)}
                    disabled={loading}
                    style={styles.actionButton}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(address._id)}
                    disabled={loading}
                    style={{ ...styles.actionButton, ...styles.dangerButton }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Inline styles for the component
const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
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
    success: {
      padding: '12px 16px',
      marginBottom: '20px',
      backgroundColor: '#f0fdf4',
      borderLeft: '4px solid #22c55e',
      color: '#166534',
      borderRadius: '4px',
      fontSize: '14px',
    },
  },
  formSection: {
    backgroundColor: '#f9fafb',
    padding: '24px',
    borderRadius: '8px',
    marginBottom: '32px',
    border: '1px solid #e5e7eb',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    fontFamily: 'inherit',
    marginTop: '4px',
  },
  checkbox: {
    marginRight: '8px',
    cursor: 'pointer',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  button: {
    padding: '10px 16px',
    borderRadius: '4px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
  },
  secondaryButton: {
    backgroundColor: '#e5e7eb',
    color: '#374151',
  },
  listSection: {
    marginTop: '32px',
  },
  loading: {
    textAlign: 'center',
    color: '#6b7280',
    padding: '20px',
  },
  noData: {
    textAlign: 'center',
    color: '#6b7280',
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
  },
  addressList: {
    display: 'grid',
    gap: '16px',
  },
  addressCard: {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  cardHeader: {
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    display: 'inline-block',
    marginLeft: '8px',
    padding: '4px 8px',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  addressInfo: {
    color: '#374151',
    fontSize: '14px',
    lineHeight: '1.5',
    marginBottom: '12px',
  },
  cardFooter: {
    borderTop: '1px solid #f3f4f6',
    paddingTop: '12px',
    marginBottom: '12px',
  },
  timestamp: {
    color: '#9ca3af',
    fontSize: '12px',
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  actionButton: {
    padding: '6px 12px',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    color: '#374151',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  dangerButton: {
    borderColor: '#fca5a5',
    color: '#dc2626',
  },
};

export default AddressManager;
