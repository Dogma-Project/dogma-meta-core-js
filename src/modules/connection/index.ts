import onConnect from "./onConnect";
import closeConnectionByNodeId from "./closeConnectionByNodeId";
import closeConnectionsByUserId from "./closeConnectionsByUserId";
import sendRequestToNode from "./sendRequestToNode";
import sendRequestToUser from "./sendRequestToUser";
import on from "./on";
import peerFromIP from "./peerFromIP";
import multicast from "./multicast";
import getConnectionByNodeId from "./getConnectionByNodeId";
import getConnectionsByUserId from "./getConnectionsByUserId";
import allowDiscoveryRequests from "./allowDiscoveryRequests";
import isNodeOnline from "./isNodeOnline";
import isUserAuthorized from "./isUserAuthorized";
import allowFriendshipRequests from "./allowFriendshipRequests";

// import streamToNode from "./streamToNode";

export {
  onConnect,
  closeConnectionByNodeId,
  closeConnectionsByUserId,
  sendRequestToNode,
  sendRequestToUser,
  on,
  peerFromIP,
  multicast,
  getConnectionByNodeId,
  getConnectionsByUserId,
  allowDiscoveryRequests,
  isNodeOnline,
  isUserAuthorized,
  allowFriendshipRequests,
};
