import { Box, Button, Container, Heading, Text, VStack, SimpleGrid, HStack, Icon, Link } from "@chakra-ui/react"
import { FaChartPie, FaWallet, FaMobileAlt, FaShieldAlt, FaGithub } from "react-icons/fa"

type HomePageProps = {
  onSignIn: () => void
}

export const HomePage = ({ onSignIn }: HomePageProps) => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        color="white"
        py={{ base: 20, md: 32 }}
      >
        <Container maxW="container.xl">
          <VStack gap={6} textAlign="center">
            <Heading
              fontSize={{ base: "4xl", md: "6xl" }}
              fontWeight="bold"
              lineHeight="1.2"
            >
              シンプルで賢い
              <br />
              家計管理
            </Heading>
            <Text fontSize={{ base: "lg", md: "xl" }} maxW="2xl" opacity={0.9}>
              あなたのお金の流れを見える化。カテゴリ別分析、月次レポート、予算管理まで、
              すべてをひとつのアプリで。
            </Text>
            <Button
              size="xl"
              colorScheme="teal"
              bg="white"
              color="purple.600"
              _hover={{ transform: "translateY(-2px)", shadow: "xl" }}
              transition="all 0.3s"
              onClick={onSignIn}
              px={8}
              py={6}
              fontSize="lg"
            >
              今すぐ始める
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20} bg="gray.50">
        <Container maxW="container.xl">
          <VStack gap={12}>
            <Heading fontSize={{ base: "3xl", md: "4xl" }} textAlign="center">
              主な機能
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={8} w="full">
              <FeatureCard
                icon={<FaChartPie size={40} />}
                title="カテゴリ別分析"
                description="食費、交通費、娯楽など、支出をカテゴリごとに自動集計して見やすいグラフで表示"
                color="purple.500"
              />
              <FeatureCard
                icon={<FaWallet size={40} />}
                title="予算管理"
                description="月ごとの予算を設定して、使いすぎを防ぐ。残り予算をリアルタイムで確認"
                color="blue.500"
              />
              <FeatureCard
                icon={<FaMobileAlt size={40} />}
                title="簡単入力"
                description="スマホからでもパソコンからでも、数秒で支出を記録。シンプルで使いやすいUI"
                color="green.500"
              />
              <FeatureCard
                icon={<FaShieldAlt size={40} />}
                title="安全なデータ"
                description="AWS Cognitoによる認証で、あなたのデータは安全に保護されます"
                color="orange.500"
              />
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box bg="purple.600" color="white" py={20}>
        <Container maxW="container.md">
          <VStack gap={6} textAlign="center">
            <Heading fontSize={{ base: "3xl", md: "4xl" }}>
              家計管理を始めよう
            </Heading>
            <Text fontSize="lg" opacity={0.9}>
              無料で今すぐ使えます。アカウントを作成してログインするだけ。
            </Text>
            <Button
              size="lg"
              bg="white"
              color="purple.600"
              _hover={{ transform: "translateY(-2px)", shadow: "xl" }}
              transition="all 0.3s"
              onClick={onSignIn}
              px={8}
              py={6}
            >
              ログイン / 新規登録
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Footer */}
      <Box bg="gray.800" color="gray.400" py={8}>
        <Container maxW="container.xl">
          <VStack gap={4}>
            <Link
              href="https://github.com/nakashita-abc/finance_management"
              target="_blank"
              rel="noopener noreferrer"
              _hover={{ color: "white", transform: "scale(1.1)" }}
              transition="all 0.2s"
            >
              <HStack gap={2}>
                <Icon fontSize="xl">
                  <FaGithub />
                </Icon>
                <Text fontSize="sm">View on GitHub</Text>
              </HStack>
            </Link>
            <Text textAlign="center" fontSize="sm">
              © 2025 Finance Management. All rights reserved.
            </Text>
          </VStack>
        </Container>
      </Box>
    </Box>
  )
}

type FeatureCardProps = {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

const FeatureCard = ({ icon, title, description, color }: FeatureCardProps) => {
  return (
    <VStack
      bg="white"
      p={8}
      borderRadius="xl"
      shadow="md"
      _hover={{
        shadow: "2xl",
        transform: "translateY(-8px)",
        borderColor: color,
      }}
      transition="all 0.3s ease"
      align="start"
      gap={4}
      borderWidth="2px"
      borderColor="transparent"
      cursor="pointer"
    >
      <Box
        color={color}
        p={3}
        bg={`${color.split('.')[0]}.50`}
        borderRadius="lg"
        transition="all 0.3s"
      >
        {icon}
      </Box>
      <Heading fontSize="xl" color="gray.800">{title}</Heading>
      <Text color="gray.600" fontSize="sm" lineHeight="1.8">
        {description}
      </Text>
    </VStack>
  )
}
