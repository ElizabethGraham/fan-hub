import FanShop from '../components/FanShop';

export default function ShopScreen({
  initialItemId,
  onBack,
}: {
  initialItemId?: string;
  onBack: () => void;
}) {
  return <FanShop initialItemId={initialItemId} onBack={onBack} />;
}
