import * as React from 'react';
import { useState } from 'react';
import { useTranslate, useNotify, useDataProvider } from 'react-admin';
import { useForm } from 'react-final-form';
import {
    Avatar,
    Card,
    CardContent,
    CardHeader,
    TextField,
    Button,
    Box,
} from '@mui/material';

const ProfilePage = () => {
    const [record, setRecord] = useState();
    const form = useForm();
    const translate = useTranslate();
    const notify = useNotify();
    const dataProvider = useDataProvider();

    const handleSave = values => {
        dataProvider
            .update('profile', { id: record.id, data: values })
            .then(({ data }) => {
                setRecord(data);
                notify('ra.notification.updated', 'info', { smart_count: 1 });
            })
            .catch(error => {
                notify(
                    typeof error === 'string'
                        ? error
                        : error.message || 'ra.notification.http_error',
                    'warning'
                );
            });
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Card sx={{ maxWidth: 300 }}>
                <CardHeader title={translate('ra.my_profile')} />
                <CardContent>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ width: 60, height: 60 }}>
                            {record &&
                                (record.avatar ? (
                                    <img src={record.avatar} alt="" />
                                ) : (
                                    record.name[0]
                                ))}
                        </Avatar>
                    </Box>
                    <div>
                        <TextField
                            label={translate('ra.auth.name')}
                            defaultValue={record && record.name}
                            onBlur={form.submit}
                            onChange={event =>
                                form.change('name', event.target.value)
                            }
                        />
                    </div>
                    <div>
                        <TextField
                            label={translate('ra.auth.email')}
                            defaultValue={record && record.email}
                            onBlur={form.submit}
                            onChange={event =>
                                form.change('email', event.target.value)
                            }
                        />
                    </div>
                    <Button onClick={() => handleSave(form.getState().values)}>
                        Save
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ProfilePage;