import { Badge, Box, Flex, Heading, Text } from '@chakra-ui/react'
import NextImage from 'next/image'

const CharacterCard = ({
  name,
  image,
  hp,
  maxHp,
  attackDmg,
  type,
  banner,
  children,
}) => {
  return (
    <Flex
      justify="center"
      direction="column"
      maxW="300px"
      w="full"
      align="center"
    >
      <Box h="400px" w="full" pos="relative" roundedTop="md" overflow="hidden">
        {banner && (
          <Box
            pos="absolute"
            zIndex="overlay"
            top="0"
            left="50%"
            transform="translate(-50%, 0)"
          >
            <Heading
              color="white"
              textTransform="uppercase"
              fontSize="18px"
              mb="2"
              bg={type === 'boss' ? '#FA129D' : '#2B60BF'}
              mt="3"
              pt="1"
              pb="1"
              pl="2"
              pr="1"
              letterSpacing="8px"
              rounded="sm"
            >
              {type === 'boss' ? 'Boss' : 'Player'}
            </Heading>
          </Box>
        )}
        <Box pos="absolute" zIndex="overlay" bottom="0">
          <Box
            bg="linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0) 100%)"
            w="100vw"
            pos="absolute"
            h="full"
            zIndex="hide"
          />
          <Box zIndex="overlay" px="3" pt="2" pb="1">
            <Badge
              bg="rgba(0,0,0,0.8)"
              color="white"
              px="1.5"
              py="0.5"
              mb="1"
              textShadow="1px 1px 0px black"
            >
              {type === 'boss' ? 'God' : 'Saiyan'}
            </Badge>
            <Text
              color="white"
              fontSize="24px"
              fontFamily="heading"
              fontWeight="700"
              fontStyle="italic"
              textTransform="uppercase"
              textShadow="2px 2px 0px black"
              mb="-1"
            >
              {name}
            </Text>
            <Text color="white" fontWeight="bold" fontSize="14px">
              {hp || maxHp ? `${hp} / ${maxHp} HP` : null}
              {attackDmg && ` • ${attackDmg} ATK`}
            </Text>
          </Box>
        </Box>
        <NextImage
          src={
            type === 'boss'
              ? image
              : `https://cloudflare-ipfs.com/ipfs/${image}`
          }
          alt={name}
          layout="fill"
          objectFit="cover"
        />
      </Box>
      {children}
    </Flex>
  )
}

export default CharacterCard
