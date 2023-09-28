import { useRef } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { deleteUsers, register, saveUsers, searchUsers } from '@/services/ant-design-pro/api';
import { Button, Form, Image, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';

const columns: ProColumns<API.CurrentUser>[] = [
  {
    dataIndex: 'id',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '用户名',
    dataIndex: 'user_name',
    copyable: true,
  },
  {
    title: '用户账号',
    dataIndex: 'user_account',
    copyable: true,
  },
  {
    title: '头像',
    dataIndex: 'avatar_url',
    hideInSearch: true,
    render: (_, record) => (
      <div>
        <Image src={record.avatar_url} width={100} />
      </div>
    ),
  },
  {
    title: '性别',
    dataIndex: 'gender',
    hideInSearch: true,
  },
  {
    title: '电话',
    dataIndex: 'phone',
    copyable: true,
  },
  {
    title: '邮件',
    dataIndex: 'email',
    copyable: true,
    hideInSearch: true,
  },
  {
    title: '状态',
    dataIndex: 'user_status',
  },
  {
    title: '星球编号',
    dataIndex: 'planet_code',
  },
  {
    title: '角色',
    dataIndex: 'user_role',
    valueType: 'select',
    valueEnum: {
      0: { text: '普通用户', status: 'Default' },
      1: {
        text: '管理员',
        status: 'Success',
      },
    },
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    valueType: 'dateTime',
    hideInSearch: true,
  },
  {
    title: '操作',
    valueType: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a href={record.avatar_url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[{ key: 'copy', name: '复制' }]}
      />,
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm<API.RegisterParams>();
  return (
    <ProTable<API.CurrentUser>
      debounceTime={500}
      columns={columns}
      actionRef={actionRef}
      cardBordered
      // @ts-ignore
      request={async (params: API.SearchUser) => {
        const userList = await searchUsers({ ...params });
        return {
          data: userList,
          // @ts-ignore
          total: userList.length,
          success: true,
        };
      }}
      editable={{
        type: 'multiple',
        onDelete: async (key, row) => {
          const successDelete = await deleteUsers(row.id);
          if (successDelete) {
            message.success('删除成功');
          } else {
            message.error('删除失败');
          }
        },
        onSave: async (key, row) => {
          console.log(row);
          const successSave = await saveUsers(row);
          if (successSave) {
            message.success('保存成功');
          } else {
            message.error('保存失败');
          }
        },
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
      }}
      dateFormatter="string"
      headerTitle="用户信息"
      toolBarRender={() => [
        <ModalForm<API.RegisterParams>
          title="创建用户"
          trigger={
            <Button type="primary">
              <PlusOutlined />
              创建用户
            </Button>
          }
          form={form}
          autoFocusFirstInput
          modalProps={{
            destroyOnClose: true,
            onCancel: () => console.log('run'),
          }}
          submitTimeout={3000}
          onFinish={async (values: API.RegisterParams) => {
            const { checkPassword, userPassword } = values;
            if (checkPassword !== userPassword) {
              message.error('新增用户失败');
              return false;
            }
            const id = await register({ ...values });
            if (id) {
              message.success('新增用户成功');
              setTimeout(() => {
                actionRef.current?.reload(); // 刷新表单
              }, 0);
              return true;
            }
            return false;
          }}
        >
          <ProForm.Group>
            <ProFormText
              width="md"
              name="userAccount"
              label="用户账号"
              placeholder="请输入用户账号"
            />
            <ProFormText
              width="md"
              name="userPassword"
              label="用户密码"
              placeholder="请输入用户密码"
            />
            <ProFormText
              width="md"
              name="checkPassword"
              label="确认用户密码"
              placeholder="请再次输入用户密码"
            />
            <ProFormText
              width="md"
              name="planetCode"
              label="星球编号"
              placeholder="请输入星球编号"
            />
          </ProForm.Group>
        </ModalForm>,
      ]}
    />
  );
};
