import React, { useState } from "react"
import { useForm } from "react-hook-form"
import styled from "styled-components"
import { submitToSlack } from "./helper"

const basicInputStyle = `
    width: 100%;
    padding: 0 1rem;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.075);
    margin-bottom: 1rem;
    border: solid 1px rgba(0, 0, 0, 0.25);
    box-shadow: none;
    font-family: "Raleway",Arial,Helvetica,sans-serif;
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.65;
`

const MessageInputArea = styled.textarea`
    ${basicInputStyle}
    min-height: 10rem;
    padding: 0.75rem 1rem;
`

const ContactInputField = styled.input`
    ${basicInputStyle}
    height: 3.25rem;
    width: calc(100% - 9rem);
    margin-right: 1rem;
`

const SubmitInputField = styled.input`
    ${basicInputStyle}
    width: 8rem;
    background-color: white;
    border: solid 1px;
`

const ContactForm = styled.form`
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;
`
const FlexRow = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: row;
`

export default function ContactFormComponent() {
    const { register, handleSubmit, formState } = useForm()
    const [error, setError] = useState(false)
    const { isSubmitted } = formState

    const onSubmit = async data => submitToSlack(setError, data)

    return (
        <ContactForm onSubmit={handleSubmit(onSubmit)}>
            <FlexRow>
                <MessageInputArea
                    id="message"
                    required
                    name="message"
                    ref={register({ required: true })}
                    placeholder="Gibt hier deine Anfrage ein"
                />
            </FlexRow>
            <FlexRow>
                <ContactInputField
                    id="contact"
                    name="contact"
                    ref={register({ required: true })}
                    required
                    placeholder="Email / Telefon"
                    type="text"
                ></ContactInputField>
                <SubmitInputField
                    id="submit"
                    value="Absenden"
                    type="submit"
                    disabled={isSubmitted && !error}
                ></SubmitInputField>
            </FlexRow>
        </ContactForm>
    )
}
