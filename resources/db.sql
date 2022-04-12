alter table contacts add column status varchar(20) after NrOfCalls;

CREATE TABLE `Agents` (
  `AgentId` varchar(100) DEFAULT NULL,
  `Extension` varchar(100) DEFAULT NULL,
  `Status` varchar(10) DEFAULT NULL,
  `CallStatus` varchar(100) DEFAULT NULL,
  `ConnectedTo` varchar(20) DEFAULT NULL,
  `UpdateTime` datetime DEFAULT NULL,
  `CallsAllocated` int(11) DEFAULT 0,
  `CallsAnswered` int(11) DEFAULT 0,
  `Department` varchar(100) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Campaigns` (
  `CampaignId` varchar(100) DEFAULT NULL,
  `StartTime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `EndTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `Status` varchar(100) DEFAULT NULL,
  `CallsAllocated` varchar(100) DEFAULT NULL,
  `CallsAnswered` varchar(100) DEFAULT NULL,
  `Department` varchar(100) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
