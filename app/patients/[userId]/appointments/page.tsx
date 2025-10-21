import StatCard from "@/components/StatCard";
import { DataTable } from "@/components/table/DataTable";
import { patientColumns } from "@/components/table/patientColumns";
import { Button } from "@/components/ui/button";
import { getPatientAppointments } from "@/lib/actions/appointment.actions";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import Link from "next/link";

const PatientAppointments = async ({
  params: { userId },
}: SearchParamProps) => {
  const appointments = await getPatientAppointments(userId);
  const patient = await getPatient(userId);

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.png"
            alt="logo"
            width={162}
            height={32}
            className="h-8 w-fit"
          />
        </Link>

        <p className="text-16-semibold">My Appointments</p>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome back, {patient?.name} 👋</h1>
          <p className="text-dark-700">
            Here&apos;s an overview of your appointments
          </p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={appointments?.scheduledCount || 0}
            label="Scheduled Appointments"
            icon="/assets/icons/appointments.svg"
          />
          <StatCard
            type="pending"
            count={appointments?.pendingCount || 0}
            label="Pending Appointments"
            icon="/assets/icons/pending.svg"
          />
          <StatCard
            type="cancelled"
            count={appointments?.cancelledCount || 0}
            label="Cancelled Appointments"
            icon="/assets/icons/cancelled.svg"
          />
        </section>

        <section className="w-full space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-32-bold">Your Appointments</h2>
            <Button asChild className="shad-primary-btn">
              <Link href={`/patients/${userId}/new-appointment`}>
                Book New Appointment
              </Link>
            </Button>
          </div>

          {appointments?.documents && appointments.documents.length > 0 ? (
            <DataTable columns={patientColumns} data={appointments.documents} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <Image
                src="/assets/icons/appointments.svg"
                alt="No appointments"
                width={80}
                height={80}
                className="mb-4 opacity-50"
              />
              <h3 className="text-24-bold mb-2">No appointments yet</h3>
              <p className="text-dark-700 mb-6 text-center max-w-md">
                You haven&apos;t booked any appointments yet. Book your first
                appointment to get started with Healio.
              </p>
              <Button asChild className="shad-primary-btn">
                <Link href={`/patients/${userId}/new-appointment`}>
                  Book Your First Appointment
                </Link>
              </Button>
            </div>
          )}
        </section>
      </main>

      <p className="copyright mt-10 py-12">© 2025 Healio</p>
    </div>
  );
};

export default PatientAppointments;
