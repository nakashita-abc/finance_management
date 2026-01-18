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
  HStack,
  Icon,
  Card,
  Text,
} from "@chakra-ui/react"
import { Field } from "@/components/ui/field"
import { FaPlusCircle, FaEdit, FaCalendarAlt, FaTag, FaFileAlt, FaYenSign } from "react-icons/fa"

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
    <Box bg="gray.50" minH="calc(100vh - 70px)">
      <Container maxW="container.md" py={8}>
        <VStack gap={6} align="stretch">
          {/* ヘッダー */}
          <HStack gap={4}>
            <Box
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              borderRadius="full"
              p={3}
            >
              <Icon fontSize="2xl" color="white">
                {id ? <FaEdit /> : <FaPlusCircle />}
              </Icon>
            </Box>
            <VStack align="start" gap={0}>
              <Heading fontSize={{ base: "2xl", md: "3xl" }} color="gray.800">
                {id ? "支出を編集" : "支出を登録"}
              </Heading>
              <Text fontSize="sm" color="gray.500">
                {id ? "登録済みの支出を編集します" : "新しい支出を記録しましょう"}
              </Text>
            </VStack>
          </HStack>

          {/* フォームカード */}
          <Card.Root shadow="lg" borderRadius="xl" overflow="hidden">
            <Box
              h="4px"
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            />
            <Card.Body p={{ base: 6, md: 8 }}>
              <Box as="form" onSubmit={handleSubmit(onSubmit)}>
                <VStack gap={6} align="stretch">
                  {/* 日付 */}
                  <Field
                    label={
                      <HStack gap={2}>
                        <Icon color="purple.500"><FaCalendarAlt /></Icon>
                        <Text>日付</Text>
                      </HStack>
                    }
                    required
                    invalid={!!errors.date}
                    errorText={errors.date?.message}
                  >
                    <Input
                      type="date"
                      size="lg"
                      borderColor="gray.300"
                      _hover={{ borderColor: "purple.400" }}
                      _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 1px #805AD5" }}
                      {...register("date", {
                        required: "日付は必須です",
                      })}
                    />
                  </Field>

                  {/* カテゴリ */}
                  <Field
                    label={
                      <HStack gap={2}>
                        <Icon color="purple.500"><FaTag /></Icon>
                        <Text>カテゴリ</Text>
                      </HStack>
                    }
                    required
                    invalid={!!errors.category}
                    errorText={errors.category?.message}
                  >
                    <NativeSelectRoot size="lg">
                      <NativeSelectField
                        borderColor="gray.300"
                        _hover={{ borderColor: "purple.400" }}
                        _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 1px #805AD5" }}
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
                    label={
                      <HStack gap={2}>
                        <Icon color="purple.500"><FaFileAlt /></Icon>
                        <Text>タイトル/説明</Text>
                      </HStack>
                    }
                    required
                    invalid={!!errors.title}
                    errorText={errors.title?.message}
                  >
                    <Textarea
                      placeholder="例: スーパーで食材購入"
                      size="lg"
                      borderColor="gray.300"
                      _hover={{ borderColor: "purple.400" }}
                      _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 1px #805AD5" }}
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
                    label={
                      <HStack gap={2}>
                        <Icon color="purple.500"><FaYenSign /></Icon>
                        <Text>金額（円）</Text>
                      </HStack>
                    }
                    required
                    invalid={!!errors.amount}
                    errorText={errors.amount?.message}
                  >
                    <Input
                      type="number"
                      placeholder="3200"
                      size="lg"
                      borderColor="gray.300"
                      _hover={{ borderColor: "purple.400" }}
                      _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 1px #805AD5" }}
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
                  <HStack gap={4} pt={4}>
                    <Button
                      type="button"
                      variant="outline"
                      colorScheme="gray"
                      size="lg"
                      flex={1}
                      onClick={handleCancel}
                      _hover={{ bg: "gray.100" }}
                    >
                      キャンセル
                    </Button>
                    <Button
                      type="submit"
                      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      color="white"
                      size="lg"
                      flex={1}
                      _hover={{ opacity: 0.9, transform: "translateY(-1px)" }}
                      transition="all 0.2s"
                    >
                      <HStack gap={2}>
                        <Icon>{id ? <FaEdit /> : <FaPlusCircle />}</Icon>
                        <Text>{id ? "更新する" : "登録する"}</Text>
                      </HStack>
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            </Card.Body>
          </Card.Root>
        </VStack>
      </Container>
    </Box>
  )
}