import { Outlet } from 'react-router-dom';
import VendorLayout from '@web/components/vendor/VendorLayout';

export default function VendorLayoutShell() {
  return (
    <VendorLayout>
      <Outlet />
    </VendorLayout>
  );
}
