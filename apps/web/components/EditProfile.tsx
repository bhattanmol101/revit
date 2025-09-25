'use client'

import { UserT } from '@revit/shared/types/user'
import { Button, Dialog, Unspaced } from '@revit/ui'
import { useState } from 'react'
import { Edit3, X } from '@tamagui/lucide-icons'

const EditProfileDialog = ({ user }: { user: UserT }) => {
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
        <Button variant="outlined" size="$2">
          <Button.Icon>
            <Edit3 size={14} color="white" />
          </Button.Icon>
          <Button.Text>Edit Profile</Button.Text>
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
            pt="$4"
            pb="$2"
            elevate
            width={500}
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
            <Dialog.Title fontSize="$2">Edit your profile</Dialog.Title>

            {/* <EditProfile user={user} handleClose={handleClose} /> */}

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

export default EditProfileDialog
