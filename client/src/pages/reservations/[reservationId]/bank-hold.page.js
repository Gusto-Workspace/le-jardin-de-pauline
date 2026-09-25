import BankHoldComponent from "@/components/bank-hold.component";
import ReservationFlowShell from "@/components/reservation-flow-shell.component";

export default function BankHoldPage({ reservationId }) {
  return <ReservationFlowShell title="Validation de votre carte"><BankHoldComponent reservationId={reservationId} apiBaseUrl={process.env.NEXT_PUBLIC_API_URL} stripePublishableKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY} /></ReservationFlowShell>;
}

export async function getServerSideProps({ params }) {
  return { props: { reservationId: params.reservationId } };
}
