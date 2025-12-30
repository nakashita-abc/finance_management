import { Button, Field, FieldRequiredIndicator, Input, Stack, Card } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { PasswordInput } from "@/components/ui/password-input"
import type { FC, MouseEventHandler } from "react"

interface FormValues {
    mailAddress: string
    password: string
}

type props={
    onLoginClick:MouseEventHandler
}

export const LoginForm:FC<props> = (props) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>()

    const onSubmit = handleSubmit((data) => console.log(data))

    return (
        <form onSubmit={onSubmit}>
            <Card.Root maxW="sm" shadow="1px 1px 1px 1px rgba(115, 242, 119, 0.2)">
                <Card.Header>
                    <Card.Title>Sign up</Card.Title>
                    <Card.Description>
                        Fill in the form below to login your account
                    </Card.Description>
                </Card.Header>
                <Card.Body>
                    <Stack gap={5}>
                        <Field.Root required invalid={!!errors.mailAddress}>
                            <Field.Label>
                                メールアドレス<FieldRequiredIndicator />
                            </Field.Label>
                            <Input placeholder="メールアドレスを入力してください"
                                {...register("mailAddress")} />
                            <Field.ErrorText>{errors.mailAddress?.message}</Field.ErrorText>
                        </Field.Root>

                        <Field.Root required invalid={!!errors.password}>
                            <Field.Label>
                                password<FieldRequiredIndicator />
                            </Field.Label>
                            <PasswordInput placeholder="パスワードを入力してください"
                                {...register("password")} />
                            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                        </Field.Root>

                        <Card.Footer justifyContent="center">
                            <Button bg="green.400"
                                color="blackAlpha600"
                                type="submit"
                                onClick={props.onLoginClick}>Login</Button>
                        </Card.Footer>
                    </Stack>
                </Card.Body>
            </Card.Root>
        </form>
    )
}