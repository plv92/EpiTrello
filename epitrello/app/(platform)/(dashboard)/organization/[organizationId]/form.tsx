"use client"

import { create } from "@/actions/create-board";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { FormInput } from "./form-input";
import { FormButton } from "./form-button";

export const Form = () => {
    const initialState = { message: null, errors: {} };
    const [state, dispatch ] = useActionState(create, initialState);

    return (
        <form action={dispatch}>
            <div className="flex flex-col space-y-2">
                <FormInput  errors={state?.errors} />
                <FormButton />
            </div>
        </form>
    )
};