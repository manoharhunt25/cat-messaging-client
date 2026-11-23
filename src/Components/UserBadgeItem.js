import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Badge
      display="inline-flex"
      alignItems="center"
      gap={1.5}
      px={2.5}
      py={1}
      borderRadius="full"
      m={1}
      bg="black"
      color="cat.500"
      fontSize="xs"
      textTransform="none"
      cursor="pointer"
      _hover={{ bg: "ink.700" }}
      onClick={handleFunction}
      title={`Remove ${user.name}`}
    >
      {user.name}
      <CloseIcon boxSize="8px" />
    </Badge>
  );
};

export default UserBadgeItem;
