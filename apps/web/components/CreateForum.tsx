import { Plus, X } from '@tamagui/lucide-icons'
import { useState } from 'react'
import CreateForum from '@revit/app/features/forum/Create'
import { Button, Dialog, Unspaced } from '@revit/ui'

const CreateForumDialog = () => {
  const [open, onOpen] = useState(false)

  const onOpenChange = () => {
    onOpen(!open)
  }

  const handleClose = () => {
    onOpen(false)
  }

  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <Button chromeless>
          <Button.Icon>
            <Plus size={24} />
          </Button.Icon>
          <Button.Text>Create Revit Forum</Button.Text>
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal width={300}>
        <Dialog.Overlay
          key="overlay"
          backgroundColor="$shadowColor"
          animateOnly={['transform', 'opacity']}
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.FocusScope focusOnIdle>
          <Dialog.Content
            bordered
            paddingVertical="$4"
            elevate
            width={600}
            minHeight={250}
            maxHeight={800}
            style={{ overflowY: 'auto', scrollbarWidth: 'thin' }}
            borderRadius="$6"
            key="content"
            animateOnly={['transform', 'opacity']}
            animation={[
              'quick',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: 20, opacity: 0 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            gap="$4"
          >
            <Dialog.Title
              fontSize="$2"
              borderBottomWidth={1}
              borderBottomColor="$black7"
              pb="$3"
              px="$2"
            >
              Create your Revit Forum
            </Dialog.Title>

            <CreateForum handleClose={handleClose} />

            <Unspaced>
              <Dialog.Close asChild>
                <Button position="absolute" right="$3" size="$2" circular icon={X} />
              </Dialog.Close>
            </Unspaced>
          </Dialog.Content>
        </Dialog.FocusScope>
      </Dialog.Portal>
    </Dialog>
  )
}

export default CreateForumDialog
