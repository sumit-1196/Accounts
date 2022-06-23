import GroupsIcon from '@mui/icons-material/Groups'
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople'
import PieChartRoundedIcon from '@mui/icons-material/PieChartRounded'
import LibraryBooksRoundedIcon from '@mui/icons-material/LibraryBooksRounded'

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: <PieChartRoundedIcon />,
  },
  {
    title: 'Vendor',
    path: '/dashboard/vendor',
    icon: <GroupsIcon />,
  },
  {
    title: 'Customer',
    path: '/dashboard/customer',
    icon: <EmojiPeopleIcon />,
  },
  {
    title: 'Entry Book',
    path: '/dashboard/entry-book',
    icon: <LibraryBooksRoundedIcon />,
  }
]

export default navConfig
