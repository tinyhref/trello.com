import canvaIcon from './agentIcons/canva.svg';
import chatgptIcon from './agentIcons/chatgpt.svg';
import chromeIcon from './agentIcons/chrome.svg';
import rovoIcon from './agentIcons/rovo.svg';

type AvailableAgent = {
  name: string;
  icon: string;
};

// This will eventually be deleted when we can properly retrieve the list of agents
const TEST_AGENTS: AvailableAgent[] = [
  { name: 'Rovo', icon: rovoIcon },
  { name: 'Canva', icon: canvaIcon },
  { name: 'Chrome', icon: chromeIcon },
  { name: 'ChatGPT', icon: chatgptIcon },
];

// This will eventually be refactored to a hook that uses a fragment where we pull the available agents by site ID or something similar
export const getAvailableRovoAgents = (filter: string = '') => {
  return TEST_AGENTS.filter((agent) =>
    agent.name.toLowerCase().startsWith(filter.toLowerCase()),
  );
};
