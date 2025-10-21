"use client";

import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";
import StatusBadge from "./StatusBadge";

interface AppointmentDetailModalProps {
  appointment: Appointment;
}

const AppointmentDetailModal = ({
  appointment,
}: AppointmentDetailModalProps) => {
  const [open, setOpen] = useState(false);

  const doctor = Doctors.find(
    (doc) => doc.name === appointment.primaryPhysician
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">Appointment Details</DialogTitle>
          <DialogDescription>
            Complete information about your appointment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Doctor Information */}
          <div className="flex items-center gap-3">
            <Image
              src={doctor?.image!}
              alt={doctor?.name!}
              width={100}
              height={100}
              className="size-12"
            />
            <div>
              <p className="text-16-semibold">Dr. {doctor?.name}</p>
              <p className="text-14-regular text-dark-600">Primary Physician</p>
            </div>
          </div>

          {/* Appointment Status */}
          <div className="flex items-center justify-between">
            <p className="text-14-medium text-dark-600">Status:</p>
            <StatusBadge status={appointment.status} />
          </div>

          {/* Date & Time */}
          <div className="flex items-center justify-between">
            <p className="text-14-medium text-dark-600">Date & Time:</p>
            <p className="text-14-semibold">
              {formatDateTime(appointment.schedule).dateTime}
            </p>
          </div>

          {/* Patient Information */}
          <div className="flex items-center justify-between">
            <p className="text-14-medium text-dark-600">Patient:</p>
            <p className="text-14-semibold">{appointment.patient.name}</p>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <p className="text-14-medium text-dark-600">Reason for Visit:</p>
            <p className="text-14-regular bg-dark-300 p-3 rounded-md">
              {appointment.reason || "No reason provided"}
            </p>
          </div>

          {/* Notes */}
          {appointment.note && (
            <div className="space-y-2">
              <p className="text-14-medium text-dark-600">Additional Notes:</p>
              <p className="text-14-regular bg-dark-300 p-3 rounded-md">
                {appointment.note}
              </p>
            </div>
          )}

          {/* Cancellation Reason */}
          {appointment.status === "cancelled" &&
            appointment.cancellationReason && (
              <div className="space-y-2">
                <p className="text-14-medium text-dark-600">
                  Cancellation Reason:
                </p>
                <p className="text-14-regular bg-red-50 border border-red-200 p-3 rounded-md text-red-800">
                  {appointment.cancellationReason}
                </p>
              </div>
            )}

          {/* Appointment ID */}
          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-14-medium text-dark-600">Appointment ID:</p>
            <p className="text-12-regular text-dark-500">{appointment.$id}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetailModal;
