import { StatusT } from '@revit/shared/types/common'
import { AnimatePresence, Spinner } from '@revit/ui'
import { CheckCircle } from '@tamagui/lucide-icons'
import { IDLE, LOADING, SUCCESS, FAILED } from '@revit/shared/utils/constants'

function Loader({ status }: { status: StatusT }) {
  return (
    <AnimatePresence>
      {status === LOADING ? (
        <Spinner
          color="$color"
          key="signin-loading-spinner"
          opacity={1}
          scale={1}
          animation="quick"
          enterStyle={{
            opacity: 0,
            scale: 0.5,
          }}
        />
      ) : status === SUCCESS ? (
        <CheckCircle
          color="$green10"
          size="$1"
          key="signin-success"
          opacity={1}
          scale={1}
          animation="quick"
          enterStyle={{
            opacity: 0,
            scale: 0.5,
          }}
        />
      ) : null}
    </AnimatePresence>
  )
}

export default Loader
