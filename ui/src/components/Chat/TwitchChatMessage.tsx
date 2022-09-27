import React from 'react';
import { IUIMultiChatMessage } from '../../store/Chat/Chat.reducer';
import { Box } from '@mui/material';

interface ITwitchChatMessageProps {
  message: IUIMultiChatMessage;
}

export const TwitchChatMessage: React.FC<ITwitchChatMessageProps> = (
  props: ITwitchChatMessageProps,
) => {
  const { message } = props;
  return (
    <Box>
      <div className='message twitch'>
        <p>
          {'['}
          {message.platform}
          {' Message]'}
        </p>
        <p>
          {message.username}
          {': '}
          {message.content}
        </p>
      </div>
    </Box>
  );
};
