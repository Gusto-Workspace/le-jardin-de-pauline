import ReservationFlowShell from "@/components/reservation-flow-shell.component";
import ResumeReservationComponent from "@/components/resume-reservation.component";

export default function ResumePage({ reservationId }) {
  return <ReservationFlowShell title="Reprendre votre validation"><ResumeReservationComponent reservationId={reservationId} apiBaseUrl={process.env.NEXT_PUBLIC_API_URL} /></ReservationFlowShell>;
}

export async function getServerSideProps({ params }) {
  return { props: { reservationId: params.reservationId } };
}
