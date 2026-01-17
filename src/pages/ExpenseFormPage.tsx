import { useParams, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  VStack,
  NativeSelectField,
  NativeSelectRoot,
  Textarea,
} from "@chakra-ui/react"
import { Field } from "@/components/ui/field"

type ExpenseFormData = {
  date: string
  category: string
  title: string
  amount: string
}

const CATEGORIES = [
  "食費",
  "交通費",
  "交際費",
  "日用品",
  "娯楽",
  "通信費",
  "電気・水道・ガス",
  "医療費",
  "衣服",
  "その他",
]

export const ExpenseFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      category: "食費",
      title: "",
      amount: "",
    },
  })

  const onSubmit = (data: ExpenseFormData) => {
    console.log("Form data:", data)

    // API未実装のため、モーダル表示
    alert("API未実装です")
  }

  const handleCancel = () => {
    navigate("/expenseList")
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack gap={6} align="stretch">
        <Heading fontSize={{ base: "2xl", md: "3xl" }} color="gray.800">
          {id ? "支出を編集" : "支出を登録"}
        </Heading>

        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          bg="white"
          p={{ base: 6, md: 8 }}
          borderRadius="lg"
          shadow="md"
        >
          <VStack gap={6} align="stretch">
            {/* 日付 */}
            <Field
              label="日付"
              required
              invalid={!!errors.date}
              errorText={errors.date?.message}
            >
              <Input
                type="date"
                {...register("date", {
                  required: "日付は必須です",
                })}
              />
            </Field>

            {/* カテゴリ */}
            <Field
              label="カテゴリ"
              required
              invalid={!!errors.category}
              errorText={errors.category?.message}
            >
              <NativeSelectRoot>
                <NativeSelectField
                  {...register("category", {
                    required: "カテゴリは必須です",
                  })}
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </NativeSelectField>
              </NativeSelectRoot>
            </Field>

            {/* タイトル */}
            <Field
              label="タイトル/説明"
              required
              invalid={!!errors.title}
              errorText={errors.title?.message}
            >
              <Textarea
                placeholder="例: スーパーで食材購入"
                {...register("title", {
                  required: "タイトルは必須です",
                  maxLength: {
                    value: 100,
                    message: "タイトルは100文字以内で入力してください",
                  },
                })}
              />
            </Field>

            {/* 金額 */}
            <Field
              label="金額（円）"
              required
              invalid={!!errors.amount}
              errorText={errors.amount?.message}
            >
              <Input
                type="number"
                placeholder="3200"
                {...register("amount", {
                  required: "金額は必須です",
                  min: {
                    value: 1,
                    message: "金額は1円以上で入力してください",
                  },
                  max: {
                    value: 10000000,
                    message: "金額は10,000,000円以下で入力してください",
                  },
                })}
              />
            </Field>

            {/* ボタン */}
            <VStack gap={3} pt={4}>
              <Button
                type="submit"
                bg="purple.600"
                color="white"
                size="lg"
                w="full"
                _hover={{ bg: "purple.700" }}
              >
                {id ? "更新する" : "登録する"}
              </Button>
              <Button
                type="button"
                variant="outline"
                colorScheme="gray"
                size="lg"
                w="full"
                onClick={handleCancel}
              >
                キャンセル
              </Button>
            </VStack>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}