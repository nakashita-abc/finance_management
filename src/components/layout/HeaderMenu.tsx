import { CloseButton, Drawer, DrawerTrigger, IconButton, Portal, VStack, Box, Text, HStack, Icon } from '@chakra-ui/react'
import { FaBars, FaChartPie, FaPlusCircle, FaListUl } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'

type MenuItemProps = {
  to: string
  icon: React.ReactElement
  label: string
  isActive: boolean
}

const MenuItem = ({ to, icon, label, isActive }: MenuItemProps) => {
  return (
    <Link to={to} style={{ textDecoration: 'none', width: '100%' }}>
      <HStack
        p={4}
        borderRadius="md"
        bg={isActive ? 'purple.100' : 'transparent'}
        _hover={{ bg: isActive ? 'purple.100' : 'gray.100' }}
        transition="all 0.2s"
        cursor="pointer"
        gap={4}
      >
        <Icon fontSize="xl" color={isActive ? 'purple.600' : 'gray.600'}>
          {icon}
        </Icon>
        <Text
          fontSize="md"
          fontWeight={isActive ? 'semibold' : 'medium'}
          color={isActive ? 'purple.700' : 'gray.700'}
        >
          {label}
        </Text>
      </HStack>
    </Link>
  )
}

export const HeaderMenu = () => {
  const location = useLocation()

  const menuItems = [
    { to: '/', icon: <FaChartPie />, label: 'ダッシュボード' },
    { to: '/incomeForm', icon: <FaPlusCircle />, label: '収入登録' },
    { to: '/expenseList', icon: <FaListUl />, label: '支出一覧' },
    { to: '/incomeForm', icon: <FaListUl />, label: '収入一覧' },
  ]

  return (
    <Drawer.Root placement="start">
      <DrawerTrigger asChild>
        <IconButton
          aria-label="メニューボタン"
          color="white"
          bg="transparent"
          _hover={{ bg: 'whiteAlpha.200' }}
        >
          <FaBars />
        </IconButton>
      </DrawerTrigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content bg="white">
            <Drawer.Header borderBottomWidth="1px" borderColor="gray.200">
              <Drawer.Title fontSize="xl" fontWeight="bold" color="purple.600">
                メニュー
              </Drawer.Title>
            </Drawer.Header>
            <Drawer.Body pt={6}>
              <VStack gap={2} align="stretch">
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    isActive={location.pathname === item.to}
                  />
                ))}
              </VStack>
            </Drawer.Body>
            <Box p={4} borderTopWidth="1px" borderColor="gray.200">
              <Text fontSize="xs" color="gray.500" textAlign="center">
                Finance Management v1.0
              </Text>
            </Box>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}
