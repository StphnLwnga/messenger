"use client"

import * as React from "react"
import clsx from "clsx";
import {FieldErrors, FieldValues, UseFormRegister} from "react-hook-form";

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errors: FieldErrors<FieldValues>;
  register: UseFormRegister<FieldValues>;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ id, className, type, label, register, errors, ...props }, ref) => {
    return (
      <div>
        <label
          className={cn(
            "block text-sm font-medium leading-6 text-muted-foreground",
          )}
          htmlFor={id}
        >
          {label}
        </label>
        <div className="mt-2">
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              className,
              'placeholder:font-mono',
              errors?.[id!] && "border-destructive focus-visible:ring-destructive",
            )}
            {...register(id!, { required: props.required })}
            {...props}
          />
        </div>
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
