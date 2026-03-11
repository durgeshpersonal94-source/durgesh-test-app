import { Outlet } from '@remix-run/react';

/**
 * Address Management Layout
 * 
 * Routes under /addresses:
 * - GET  /addresses              - List all addresses (addresses._index.tsx)
 * - GET  /addresses/new          - Add new address form (addresses.new.tsx)
 * - GET  /addresses/:id/edit     - Edit address form (addresses.[id].edit.tsx)
 * - POST /addresses/:id/edit     - Update address (addresses.[id].edit.tsx action)
 * - POST /addresses              - Delete address (addresses._index.tsx action)
 * - POST /addresses/:id/setDefault - Set default address (addresses.[id].setDefault.tsx)
 */

export default function AddressesLayout() {
  return <Outlet />;
}
