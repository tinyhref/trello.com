import { kebabCase } from 'change-case';
import { useContext } from 'react';

import traceUFOInteraction from '@atlaskit/react-ufo/trace-interaction';
import traceUFOPress from '@atlaskit/react-ufo/trace-press';

import type { PressExperienceKey } from './experiences';
import { UFOGateContext } from './UFOGate';

/**
 * A callback function to trigger a UFO press event. Calls either
 * {@link https://developer.atlassian.com/platform/ufo/react-ufo/react-ufo/api-reference/#traceufopress | traceUFOPress}
 * or {@link https://developer.atlassian.com/platform/ufo/react-ufo/react-ufo/api-reference/#traceufointeraction | traceUFOInteraction},
 * depending on if an event is passed to the callback function when called.
 *
 * @param event (optional) Specify an event to be included in the UFO event data.
 */
type UFOPressTracingCallback = (
  event?: Event | React.UIEvent<Element, UIEvent>,
) => void;

/**
 * React hook that returns a callback function for UFO press tracing. Calls either
 * {@link https://developer.atlassian.com/platform/ufo/react-ufo/react-ufo/api-reference/#traceufopress | traceUFOPress}
 * or {@link https://developer.atlassian.com/platform/ufo/react-ufo/react-ufo/api-reference/#traceufointeraction | traceUFOInteraction},
 * depending on if an event is passed to the callback function when called.
 *
 * A feature gate can be specified in a parent {@link UFOGateContext} to return a no-op callback if the gate is falsy.
 *
 * @param name The name of the interaction. Will be converted to kebab case.
 * @returns A callback function for UFO press tracing. {@link UFOPressTracingCallback}
 */
export const usePressTracing = (
  name: PressExperienceKey,
): UFOPressTracingCallback => {
  const featureGateEnabled = useContext(UFOGateContext);
  const pressInteractionName = kebabCase(name);

  return (event?: Event | React.UIEvent<Element, UIEvent>) => {
    if (featureGateEnabled) {
      if (event) {
        const supportedEventTypes = [
          'click',
          'dblclick',
          'mousedown',
          'mouseenter',
          'mouseover',
        ];

        // Use traceUFOInteraction for supported event types, otherwise use traceUFOPress with timestamp
        if (supportedEventTypes.includes(event.type)) {
          traceUFOInteraction(pressInteractionName, event);
        } else {
          traceUFOPress(pressInteractionName, event.timeStamp);
        }
      } else {
        traceUFOPress(pressInteractionName);
      }
    }
  };
};
