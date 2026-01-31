import { AddressesContent } from '../components';

export default function AddressesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">
        Địa chỉ giao nhận
      </h1>
      <AddressesContent />
    </div>
  );
}
