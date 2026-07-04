import { Box, FileButton, Flex, rem, Text, UnstyledButton } from '@mantine/core';
import React from 'react';
import classes from "./App.module.css";
import { IconPhoto } from '@tabler/icons-react';
import { useFileState } from '../../state';
import { useNavigate } from 'react-router-dom';

const HomeLayer: React.FC = () => {
  const [file, setFile] = useFileState();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!file) return;

    navigate("/file");
  }, [file]);

  return (
    <Flex
      w="100%"
      h="100%"

      justify="center"
      align="center"
    >
      <FileButton onChange={setFile} accept="image/png,image/jpeg">
        {(props) =>
          <UnstyledButton {...props}>
            <Box className={classes.button}>
              <Text size="lg" fw={600} c={"snow.3"}>PICK A FILE</Text>

              <IconPhoto className={classes.icon} stroke={2} size={rem(32)} />
            </Box>
          </UnstyledButton>
        }
      </FileButton>
    </Flex>
  );
};

export default HomeLayer;