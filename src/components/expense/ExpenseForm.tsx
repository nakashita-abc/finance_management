import {
  Box,
  Card,
  Input,
  NativeSelectField,
  NativeSelectRoot,
  Textarea,
  VStack,
  Text,
} from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { useForm } from "react-hook-form";
import type { expense } from "@/types/expense";
import { ExpenseFormAction } from "./ExpenseFormAction";

const inputStyles = {
  borderColor: "gray.300",
  _hover: { borderColor: "purple.400" },
  _focus: { borderColor: "purple.500", boxShadow: "0 0 0 1px #805AD5" },
};

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
];

type Props = {
  createExpense: (data: expense) => Promise<void>;
};

export const ExpenseForm = (props: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<expense>({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      category: "食費",
      title: "",
      amount: 0,
    },
  });

  return (
    <Card.Root shadow="lg" borderRadius="xl" overflow="hidden">
      <Box h="4px" bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" />
      <Card.Body p={{ base: 6, md: 8 }}>
        <Box as="form" onSubmit={handleSubmit(props.createExpense)}>
          <VStack gap={6} align="stretch">
            <Field
              label={<Text>日付</Text>}
              required
              invalid={!!errors.date}
              errorText={errors.date?.message}
            >
              <Input
                type="date"
                size="lg"
                {...inputStyles}
                {...register("date", {
                  required: "日付は必須です",
                })}
              />
            </Field>

            <Field
              label={<Text>カテゴリ</Text>}
              required
              invalid={!!errors.category}
              errorText={errors.category?.message}
            >
              <NativeSelectRoot size="lg">
                <NativeSelectField
                  {...inputStyles}
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

            <Field
              label={<Text>タイトル/説明</Text>}
              required
              invalid={!!errors.title}
              errorText={errors.title?.message}
            >
              <Textarea
                placeholder="例: スーパーで食材購入"
                size="lg"
                {...inputStyles}
                {...register("title", {
                  required: "タイトルは必須です",
                  maxLength: {
                    value: 100,
                    message: "タイトルは100文字以内で入力してください",
                  },
                })}
              />
            </Field>

            <Field
              label={<Text>金額（円）</Text>}
              required
              invalid={!!errors.amount}
              errorText={errors.amount?.message}
            >
              <Input
                type="number"
                placeholder="3200"
                size="lg"
                {...inputStyles}
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
            <ExpenseFormAction/>
          </VStack>
        </Box>
      </Card.Body>
    </Card.Root>
  );
};
