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
import type { income } from "@/types/income";
import { IncomeFormAction } from "./IncomeFormAction";

const inputStyles = {
  borderColor: "gray.300",
  _hover: { borderColor: "green.400" },
  _focus: { borderColor: "green.500", boxShadow: "0 0 0 1px #38a169" },
};

const CATEGORIES = [
  "給与",
  "副業",
  "投資",
  "賞与",
  "年金",
  "その他",
];

type Props = {
  createIncome: (data: income) => Promise<void>;
};

export const IncomeForm = (props: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<income>({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      category: "給与",
      amount: 0,
      memo: "",
    },
  });

  return (
    <Card.Root shadow="lg" borderRadius="xl" overflow="hidden">
      <Box h="4px" bg="linear-gradient(135deg, #38a169 0%, #276749 100%)" />
      <Card.Body p={{ base: 6, md: 8 }}>
        <Box as="form" onSubmit={handleSubmit(props.createIncome)}>
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
              label={<Text>金額（円）</Text>}
              required
              invalid={!!errors.amount}
              errorText={errors.amount?.message}
            >
              <Input
                type="number"
                placeholder="300000"
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
              label={<Text>メモ（任意）</Text>}
              invalid={!!errors.memo}
              errorText={errors.memo?.message}
            >
              <Textarea
                placeholder="例: 3月分給与"
                size="lg"
                {...inputStyles}
                {...register("memo", {
                  maxLength: {
                    value: 200,
                    message: "メモは200文字以内で入力してください",
                  },
                })}
              />
            </Field>

            <IncomeFormAction />
          </VStack>
        </Box>
      </Card.Body>
    </Card.Root>
  );
};
