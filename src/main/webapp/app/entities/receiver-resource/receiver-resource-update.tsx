import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps} from 'react-router-dom';
import {Translate, translate} from 'react-jhipster';
import {IRootState} from 'app/shared/reducers';
import {getEntities as getResourceTypes} from 'app/entities/resource-type/resource-type.reducer';
import {getEntities as getReceiverSuppliers} from 'app/entities/receiver-supplier/receiver-supplier.reducer';
import {createEntity, getEntity, reset, updateEntity} from './receiver-resource.reducer';
import ReceiverSupplierFields from "app/entities/receiver-supplier/receiver-supplier-fields";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Rate,
  Row,
  Select,
  Slider,
  Switch,
  Upload
} from "antd";
import {ArrowLeftOutlined, SaveOutlined, UploadOutlined} from '@ant-design/icons';
import UploadFile from "app/commonComponents/UploadFile";
const {Option} = Select;
const normFile = e => {
  // console.log(e)
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};
export interface IReceiverResourceUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {
}
export const ReceiverResourceUpdate = (props: IReceiverResourceUpdateProps) => {
  const [resourceTypeId, setResourceTypeId] = useState('0');
  const [receiverId, setReceiverId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);
  const [pofFileList, setPofFileList] = useState('');
  const [pofFiles, setPofFiles] = useState([]);
  const {receiverResourceEntity, resourceTypes, receiverSuppliers, loading, updating, account} = props;
  const receiverProfile = receiverSuppliers.filter((receiver) => (
    receiver.email === account.email && receiver.isReceiver
  ));
  const handleClose = () => {
    props.history.push('/receiver-resource');
  };
  const updatePofFileList = (file) => {
    if (!pofFileList.includes(file.name)) {
      setPofFileList(`${pofFileList.length > 0 ? `${pofFileList},` : ''}${file.name}`)
    }
  };
  const updatePofFiles = (file) => {
    setPofFiles([...pofFiles, file])
  };
  useEffect(() => {
    if (!isNew) {
      props.getEntity(props.match.params.id);
    }
    props.getResourceTypes();
    props.getReceiverSuppliers();
  }, []);
  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);
  const mayBeReceiverFields = () => {
    if (receiverProfile.length > 0) {
      return null;
    }
    return (
      <React.Fragment>
        <h2 id="crownApp.supplierResource.home.createReceiverLabel">
          <Translate contentKey="crownApp.supplierResource.home.createReceiverLabel">Who is requesting this
            resource</Translate>
        </h2>
        <ReceiverSupplierFields fieldPrefix="receiver."/>
      </React.Fragment>
    )
  };
  const saveEntity = (values) => {
    const entity = {
      ...receiverResourceEntity,
      ...values
    };
    if (isNew) {
      const query = new URLSearchParams(props.location.search);
      const lat = query.get('lat') || '';
      const lng = query.get('lng') || '';
      entity.position = [lat, lng];
      if (receiverProfile.length === 0 && entity.receiver) {
        if (!entity.receiver.latx) {
          entity.receiver.latx = lat;
        }
        if (!entity.receiver.longy) {
          entity.receiver.longy = lng;
        }
      } else {
        entity.receiver = {
          email: account.email,
          latx: lat,
          longy: lng,
          name: account.firstName + " " + account.lastName,
          primaryContactName: account.email
        };
      }
      props.createEntity(entity);
    } else {
      props.updateEntity(entity);
    }
  };
  return (
    <div>
      <Row className="justify-content-center">
        <Col span={16}>
          <h2 id="crownApp.receiverResource.home.createLable">
            <Translate contentKey="crownApp.receiverResource.home.createLabel">Request a Resource</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col span={16}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Form
              name="receiverResource"
              onFinish={saveEntity}
              layout="vertical"
              initialValues={{}}
            >
              {!isNew ? (
                <Form.Item
                  name="id"
                  label={translate('global.field.id')}
                  rules={[
                    {
                      required: true,
                      message: '',
                    },
                  ]}
                >
                  <Input/>
                </Form.Item>
              ) : null}
              <Form.Item
                name="resourceType.id"
                label={translate('crownApp.receiverResource.resourceType')}
                rules={[
                  {
                    required: true,
                    message: 'Please select a resource type!',
                  },
                ]}
              >
                <Select placeholder="Select a resource type">
                  <Option value="" key="0">Select</Option>
                  {resourceTypes
                    ? resourceTypes.map(otherEntity => (
                      <Option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.name}
                      </Option>
                    ))
                    : null}
                </Select>
              </Form.Item>
              <Form.Item
                name="name"
                label={translate('crownApp.receiverResource.name')}
                rules={[
                  {
                    required: true,
                    message: translate('entity.validation.required'),
                  },
                ]}
              >
                <Input placeholder="Enter name of resource"/>
              </Form.Item>
              <Form.Item
                name="quantity"
                label={translate('crownApp.receiverResource.quantity')}
                rules={[
                  {
                    required: true,
                    message: translate('entity.validation.required'),
                  },
                ]}
              >
                <InputNumber min={1} style={{width: '100%'}}/>
              </Form.Item>
              <Form.Item
                name="dailyUse"
                label={translate('crownApp.receiverResource.dailyUse')}
                rules={[
                  {
                    required: true,
                    message: translate('entity.validation.required'),
                  },
                ]}
              >
                <InputNumber min={1} style={{width: '100%'}}/>
              </Form.Item>
              <Form.Item
                name="postedDate"
                label={translate('crownApp.receiverResource.postedDate')}
                rules={[
                  {
                    required: true,
                    message: translate('entity.validation.required'),
                  },
                ]}
              >
                <DatePicker style={{width: '100%'}}/>
              </Form.Item>
              <Form.Item
                name="expiration"
                label={translate('crownApp.receiverResource.expiration')}
              >
                <DatePicker style={{width: '100%'}}/>
              </Form.Item>
              <Form.Item
                name="currentStock"
                label={translate('crownApp.receiverResource.currentStock')}
              >
                <InputNumber style={{width: '100%'}}/>
              </Form.Item>
              <Form.Item
                name="notes"
                label={translate('crownApp.receiverResource.notes')}
              >
                <Input/>
              </Form.Item>
              <Form.Item
                name="productInspection"
                label={translate('crownApp.receiverResource.productInspection')}
                valuePropName="checked">
                <Switch/>
              </Form.Item>
              <Form.Item
                name="productInspectDays"
                label={translate('crownApp.receiverResource.productInspectDays')}
              >
                <InputNumber style={{width: '100%'}}/>
              </Form.Item>
              <Form.Item
                name="acceptUnpackagedGoods"
                valuePropName="checked"
              >
                <Checkbox>
                  <Translate contentKey="crownApp.receiverResource.acceptUnpackagedGoods">Are you willing to accept
                    unpackaged goods?</Translate>
                </Checkbox>
              </Form.Item>
              <Form.Item
                name="fundRestrictions"
                label={translate('crownApp.receiverResource.fundRestrictions')}
              >
                <Input/>
              </Form.Item>
              <Form.Item
                name="fundsAvailable"
                label={translate('crownApp.receiverResource.fundsAvailable')}
                valuePropName="checked">
                <Switch/>
              </Form.Item>
              <Form.Item
                name="pofFiles"
                label={translate('crownApp.receiverResource.pof')}
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <UploadFile
                  action="api/document/upload"
                  onSuccess={updatePofFileList}
                  fileList={pofFiles}
                  data={{
                    entityType: 'buy',
                    fieldType: 'pof',
                  }}
                />
              </Form.Item>
              <Row gutter={[0, 8]}>
                <Col span={4}>
                  <Form.Item>
                    <Button type="default" htmlType="submit" icon={<ArrowLeftOutlined/>}>
                      {translate('entity.action.back')}
                    </Button>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined/>}>
                      <Translate contentKey="entity.action.save">Save</Translate>
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
              <Input type="hidden" name="isBuyer" value="true"/>
            </Form>
            )}

        </Col>
      </Row>
    </div>
  );
};
const mapStateToProps = (storeState: IRootState) => ({
  resourceTypes: storeState.resourceType.entities,
  receiverSuppliers: storeState.receiverSupplier.entities,
  receiverResourceEntity: storeState.receiverResource.entity,
  loading: storeState.receiverResource.loading,
  updating: storeState.receiverResource.updating,
  updateSuccess: storeState.receiverResource.updateSuccess,
  account: storeState.authentication.account
});
const mapDispatchToProps = {
  getResourceTypes,
  getReceiverSuppliers,
  getEntity,
  updateEntity,
  createEntity,
  reset
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(mapStateToProps, mapDispatchToProps)(ReceiverResourceUpdate);
