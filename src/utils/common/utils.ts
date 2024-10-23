export const getStatusBadge = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "bg-green-500 hover:bg-green-600" ;
        case "rejected":
          return "bg-red-500 hover:bg-red-600" ;
          case "pending":
            return   "bg-yellow-500 hover:bg-yellow-600" ;
            case "active":
                return "bg-blue-500 hover:bg-blue-600" ;
                case "completed":
                    return "bg-green-500 hover:bg-green-600" ;
      default:
        return  "bg-gray-500 hover:bg-gray-600" ;
    }
  };