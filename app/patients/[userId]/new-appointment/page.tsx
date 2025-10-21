import AppointmentForm from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import Link from "next/link";

export default async function NewAppointment({
  params: { userId },
}: SearchParamProps) {
  const patient = await getPatient(userId);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <div className="flex items-center justify-between mb-12">
            <Image
              src="/assets/icons/logo-full.png"
              alt="patient"
              width={1000}
              height={1000}
              className="h-10 w-fit"
            />

            <Link
              href={`/patients/${userId}/appointments`}
              className="text-green-500 hover:underline text-14-regular"
            >
              View My Appointments
            </Link>
          </div>

          <AppointmentForm
            type="create"
            userId={userId}
            patientId={patient?.$id}
          />

          <p className="copyright mt-10 py-12">Â© 2025 Healio</p>
        </div>
      </section>
      <Image
        src="/assets/images/appointment-img.png"
        alt="appointment"
        width={1000}
        height={1000}
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
}
