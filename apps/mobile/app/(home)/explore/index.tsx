import Explore from '@revit/app/features/explore'
import { useSession } from '../../../components/Provider/ContextProvider'

function ExploreScreen() {
  const { user } = useSession()
  if (!user) {
    return
  }

  return <Explore user={user} />
}

export default ExploreScreen
