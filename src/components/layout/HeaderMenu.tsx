import { CloseButton, Drawer, DrawerTrigger, IconButton, Portal } from '@chakra-ui/react';
import { FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';

//TODO:ログアウト押下したら認証をfalseにする
//TODO:項目のレイアウトを調整
export const HeaderMenu = () => {
    return (
        <Drawer.Root placement="start">
            <DrawerTrigger asChild>
                <IconButton aria-label='メニューボタン'
                    color="blackAlpha.700"
                    bg="gray.100"><FaBars /></IconButton>
            </DrawerTrigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content bg="green.300">
                        <Drawer.Header>
                            <Drawer.Title />
                        </Drawer.Header>
                        <Drawer.Body>
                            <Link to="/dashbord">ダッシュボード</Link><br/>
                            <Link to="/expenseList">支出一覧</Link><br/>
                            <Link to="/">ログアウト</Link>
                        </Drawer.Body>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>

    )
}
