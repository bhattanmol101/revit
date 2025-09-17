import { SizeTokens, Avatar as TamagAvatar } from '@revit/ui'

interface AvatarProps {
  size?: number | SizeTokens
  image?: string
}

const Avatar = ({ size = '$3', image }: AvatarProps) => {
  const defaultImage =
    'https://polsjqhrbgmnoivxcjrj.supabase.co/storage/v1/object/public/profile-bucket/defaultProfileImage.png'
  return (
    <TamagAvatar circular size={size}>
      <TamagAvatar.Image
        source={{
          uri: image ? image : defaultImage,
        }}
      />
    </TamagAvatar>
  )
}

export default Avatar
