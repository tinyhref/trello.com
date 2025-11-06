import { New } from './basic';
import {
  Bolt,
  Box,
  Building,
  Lego,
  Lightbulb,
  Megaphone,
  Pencil,
  Star,
} from './object';
import {
  BrowserCode,
  GlobeNetworkLocation,
  TrelloCardTemplates,
  TrelloIntegrations,
} from './software';
import { ButlerAutomationHead, RocketInclined } from './trello';

export function getIcon(iconName: string) {
  switch (iconName) {
    case 'New':
      return New();
    case 'Bolt':
      return Bolt();
    case 'Box':
      return Box();
    case 'Building':
      return Building();
    case 'Lego':
      return Lego();
    case 'Lightbulb':
      return Lightbulb();
    case 'Megaphone':
      return Megaphone();
    case 'Pencil':
      return Pencil();
    case 'Star':
      return Star();
    case 'BrowserCode':
      return BrowserCode();
    case 'GlobeNetworkLocation':
      return GlobeNetworkLocation();
    case 'TrelloCardTemplates':
      return TrelloCardTemplates();
    case 'TrelloIntegrations':
      return TrelloIntegrations();
    case 'ButlerAutomationHead':
      return ButlerAutomationHead();
    case 'RocketInclined':
      return RocketInclined();
    default:
      return null;
  }
}
