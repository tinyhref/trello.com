import type { FunctionComponent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Portal from '@atlaskit/portal';
import { useClickOutside } from '@trello/dom-hooks';
import { getKey, Key, Scope, useShortcut } from '@trello/keybindings';
import { Button } from '@trello/nachos/button';
import { getAvailableRovoAgents } from '@trello/rovo';

import * as styles from './AiAgentMentionSelector.module.less';

interface AiAgentMentionSelectorProps {
  inputValue: string;
  inputElement: HTMLTextAreaElement | null;
  onVisibilityChange?: (isVisible: boolean) => void;
  onRequestFocusRestore?: () => void;
  onSelectAgent?: (agentName: string) => void;
}

/**
 * A dropdown selector that appears when typing @ mentions in the card composer.
 *
 * Features:
 * - Detects @ mentions in the input and shows matching AI agents
 * - Positions itself below the input element
 * - Supports keyboard navigation (Arrow Up/Down, Enter, Space, Escape)
 * - Closes on click outside, Escape key, or agent selection
 * - Highlights the currently selected agent for keyboard navigation
 *
 * @example
 * ```tsx
 * <AiAgentMentionSelector
 *   inputValue={text}
 *   inputElement={textareaRef.current}
 *   onSelectAgent={(agentName) => insertAgentMention(agentName)}
 * />
 * ```
 */
export const AiAgentMentionSelector: FunctionComponent<
  AiAgentMentionSelectorProps
> = ({
  inputValue,
  inputElement,
  onVisibilityChange,
  onRequestFocusRestore,
  onSelectAgent,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  // Track which agent is highlighted for keyboard navigation by name
  const [highlightedAgentName, setHighlightedAgentName] = useState<
    string | null
  >(null);

  // Ref for click outside detection
  const containerRef = useRef<HTMLDivElement>(null);

  const mentionRegexMatch = inputValue.match(/.*@([a-zA-Z]*)/);
  const mention = mentionRegexMatch?.[1];

  const isMentioning =
    mention !== undefined && inputValue.trimEnd().endsWith(`@${mention}`);

  const matchingAgents = getAvailableRovoAgents(mention);

  const closeSelector = useCallback(() => {
    setIsVisible(false);
    setPosition(null);
    onVisibilityChange?.(false);
    onRequestFocusRestore?.();
  }, [onVisibilityChange, onRequestFocusRestore]);

  /**
   * Manage highlighted agent when the list changes or selector becomes visible
   * - If the currently highlighted agent is still in the list, keep it highlighted
   * - Otherwise, highlight the first agent
   * - This ensures we don't lose the user's selection when they continue typing
   */
  useEffect(() => {
    if (isVisible && matchingAgents.length > 0) {
      const currentlyHighlightedStillExists =
        highlightedAgentName &&
        matchingAgents.some((agent) => agent.name === highlightedAgentName);

      if (!currentlyHighlightedStillExists) {
        setHighlightedAgentName(matchingAgents[0].name);
      }
    }
  }, [isVisible, matchingAgents, highlightedAgentName]);

  /**
   * Calculate and update the selector's position based on the input element.
   * The selector appears directly below the textarea when user is mentioning.
   */
  useEffect(() => {
    if (inputElement && isMentioning) {
      const rect = inputElement.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
      setIsVisible(true);
      onVisibilityChange?.(true);
    } else {
      closeSelector();
    }
  }, [inputElement, isMentioning, onVisibilityChange, closeSelector]);

  /**
   * Handles agent selection - notifies parent and closes the selector
   * @param agentName - The name of the selected agent
   */
  const selectAgent = useCallback(
    (agentName: string) => {
      onSelectAgent?.(agentName);
      closeSelector();
    },
    [onSelectAgent, closeSelector],
  );

  const handleClose = useCallback(() => {
    if (isVisible) {
      closeSelector();
    }
  }, [isVisible, closeSelector]);

  /**
   * Handle keyboard navigation within the selector
   *
   * Keyboard shortcuts:
   * - ArrowDown: Move highlight to next agent (wraps to first)
   * - ArrowUp: Move highlight to previous agent (wraps to last)
   * - Enter/Space: Select the currently highlighted agent
   * - All other keys: Pass through to the textarea for normal typing
   */
  useEffect(() => {
    if (!isVisible || !inputElement || matchingAgents.length === 0) return;

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      const key = getKey(e);

      if (key === Key.ArrowDown) {
        e.preventDefault();
        // Find current index and move to next agent
        const currentIndex = matchingAgents.findIndex(
          (agent) => agent.name === highlightedAgentName,
        );
        const nextIndex =
          currentIndex >= matchingAgents.length - 1 ? 0 : currentIndex + 1;
        setHighlightedAgentName(matchingAgents[nextIndex].name);
      } else if (key === Key.ArrowUp) {
        e.preventDefault();
        // Find current index and move to previous agent
        const currentIndex = matchingAgents.findIndex(
          (agent) => agent.name === highlightedAgentName,
        );
        const prevIndex =
          currentIndex <= 0 ? matchingAgents.length - 1 : currentIndex - 1;
        setHighlightedAgentName(matchingAgents[prevIndex].name);
      } else if (key === Key.Enter || key === Key.Space) {
        // Select the highlighted agent (if one exists)
        if (highlightedAgentName) {
          e.preventDefault();
          // stop propagation to prevent also saving the card on agent selection
          e.stopPropagation();
          selectAgent(highlightedAgentName);
        }
      }
      // Other keys pass through for normal typing
    };

    inputElement.addEventListener('keydown', handleKeyDown);
    return () => {
      inputElement.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    isVisible,
    inputElement,
    matchingAgents,
    highlightedAgentName,
    selectAgent,
  ]);

  useClickOutside({ ref: containerRef, handleClickOutside: handleClose });

  useShortcut(handleClose, {
    scope: Scope.Popover,
    key: Key.Escape,
    enabled: isVisible,
  });

  if (!isVisible || !position) {
    return null;
  }

  return (
    <Portal zIndex={1000}>
      <div
        ref={containerRef}
        className={styles.container}
        style={{
          position: 'fixed',
          // subtracting 20 to account for an extra line always being shown below the cursor
          // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
          top: position.top - 20,
          // adding 4 to inset within the card composer a bit
          // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
          left: position.left + 4,
        }}
      >
        <h3 className={styles.header} id="suggested-agents-header">
          <FormattedMessage
            id="templates.ai-labs.suggested"
            defaultMessage="Suggested"
            description="Suggested AI agents"
          />
        </h3>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role */}
        <ul role="listbox" aria-labelledby="suggested-agents-header">
          {matchingAgents.map((agent) => (
            <li
              key={agent.name}
              aria-label={agent.name}
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
              role="option"
              aria-selected={agent.name === highlightedAgentName}
            >
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  selectAgent(agent.name);
                }}
                appearance="subtle"
                iconBefore={<img src={agent.icon} alt="" />}
                className={styles.agentButton}
                size="fullwidth"
                // Highlight the agent if it matches the keyboard navigation selection
                data-highlighted={agent.name === highlightedAgentName}
              >
                {agent.name}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </Portal>
  );
};
