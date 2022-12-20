/*
 *
 * HomePage
 *
 */

import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Textarea, GridLayout } from '@strapi/design-system';
import { Write, Lock } from '@strapi/icons';
import axiosInstance from "../../utils/axiosInstance";
import pluginId from '../../pluginId';

interface IFormValues {
  credentials: string;
}

const HomePage: React.FC = () => {
  const [value, setValue] = useState<IFormValues>({
    credentials: '',
  });
  const [saving, setSaving] = useState(false);
  const [editable, setEditable] = useState(true);

  /**
   * Get credentials from API
   */
  const getFirebaseCredentials = async () => {
    try {
      const { data } = await axiosInstance.get(`/${pluginId}/credentials`);

      if (data.credentials) {
        setValue({
          credentials: data.credentials,
        })
        setEditable(false);
      }
    } catch (e) {
      console.log(e);
      setEditable(true);
    }
  }

  useEffect(() => {
    void getFirebaseCredentials();
  }, []);

  /**
   * Update form values
   */
  const updateValue = (newVal: Partial<IFormValues>): void => {
    setValue({
      ...value,
      ...newVal,
    });
  }

  /**
   * Make form editable
   */
  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditable(true);
  }

  /**
   * Save firebase credentials
   */
  const saveForm = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSaving(true);

    try {
      await axiosInstance.post(`/${pluginId}/credentials/save`, {
        credentials: value.credentials,
      })
      setSaving(false);
    } catch (error) {
      setSaving(false);
      console.log(error)
    }
  }

  return (
    <div>
      <Box padding={8} background="neutral100">
        <h1>Firebase Admin Credentials</h1>
        <GridLayout>
          <Box padding={4} marginTop={4} hasRadius background="neutral0" shadow="tableShadow">
            <Textarea
              required
              disabled={!editable}
              label="Credentials"
              name="credentials"
              hint='{"type": "service_account", "project_id": "xxx-3bd42", ...}'
              onChange={e => updateValue({ credentials: e.target.value })}
              style={{ height: '30rem' }}
              value={value.credentials}
            />
          </Box>
        </GridLayout>
        <Flex marginTop={4} justifyContent="space-between">
          <Button disabled={editable} onClick={handleEdit} size="L" endIcon={<Write />} variant='secondary'>Edit</Button>
          <Button disabled={!editable} loading={saving} onClick={saveForm} size="L" endIcon={<Lock />} variant='default'>Save Credentials</Button>
        </Flex>
      </Box>
    </div>
  );
};

export default HomePage;
