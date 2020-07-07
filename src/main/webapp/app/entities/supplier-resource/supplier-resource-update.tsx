import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Link, RouteComponentProps} from 'react-router-dom';
import {Translate, translate} from 'react-jhipster';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IRootState} from 'app/shared/reducers';
import {getEntities as getResourceTypes} from 'app/entities/resource-type/resource-type.reducer';
import {getEntities as getReceiverSuppliers} from 'app/entities/receiver-supplier/receiver-supplier.reducer';
import {createEntity, getEntity, reset, updateEntity} from './supplier-resource.reducer';
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
import { ArrowLeftOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import UploadFile from "app/commonComponents/UploadFile";
const { Option } = Select;
const normFile = e => {
  // console.log(e)
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

export interface ISupplierResourceUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {
}

export const SupplierResourceUpdate = (props: ISupplierResourceUpdateProps) => {
  const [resourceTypeId, setResourceTypeId] = useState('0');
  const [supplierId, setSupplierId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const {supplierResourceEntity, resourceTypes, receiverSuppliers, loading, updating, account} = props;
  const supplierProfile = receiverSuppliers.filter((supplier) => (
    supplier.email === account.email && supplier.isSupplier
  ));

  let lat;
  let lng;

  const handleClose = () => {
    props.history.push('/supplier-resource');
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

  const mayBeSupplierFields = () => {
    if (supplierProfile.length > 0) {
      return null;
    }
    return (
      <React.Fragment>
        <h2 id="crownApp.supplierResource.home.createSupplierLabel">
          <Translate contentKey="crownApp.supplierResource.home.createSupplierLabel">Who is offering this resource</Translate>
        </h2>
        <ReceiverSupplierFields fieldPrefix="supplier."/>
      </React.Fragment>
    )
  };

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...supplierResourceEntity,
        ...values
      };

      if (isNew) {
        const query = new URLSearchParams(props.location.search);
        lat = query.get('lat');
        lng = query.get('lng');
        entity.position = [lat, lng];

        if (supplierProfile.length === 0 && entity.supplier) {
          if (!entity.supplier.latx) {
            entity.supplier.latx = lat;
          }
          if (!entity.supplier.longy) {
            entity.supplier.longy = lng;
          }
        } else {
          entity.supplier = {
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
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col span={16}>
          <h2 id="crownApp.supplierResource.home.createLabel">
            <Translate contentKey="crownApp.supplierResource.home.createLabel">Sell a Resource</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col span={16}>
          {loading ? (
            <p>Loading...</p>
          ) : (
              <Form
                name="supplierResource"
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
                    <Input />
                  </Form.Item>
                ) : null}

                <Form.Item
                  name="resourceType.id"
                  label={translate('crownApp.supplierResource.resourceType')}
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
                  name="quantity"
                  label={translate('crownApp.supplierResource.quantity')}
                  rules={[
                    {
                      required: true,
                      message: translate('entity.validation.required'),
                    },
                  ]}
                >
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  name="quantityValidUntil"
                  label={translate('crownApp.supplierResource.quantityValidUntil')}
                  rules={[
                    {
                      required: true,
                      message: translate('entity.validation.required'),
                    },
                  ]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  name="cost"
                  label={translate('crownApp.supplierResource.cost')}
                  rules={[
                    {
                      required: true,
                      message: translate('entity.validation.required'),
                    },
                  ]}
                >
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  name="productAvailabilityLeadTime"
                  label={translate('crownApp.supplierResource.productAvailabilityLeadTime')}
                  rules={[
                    {
                      required: true,
                      message: translate('entity.validation.required'),
                    },
                  ]}
                >
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  name="minOrderQuantity"
                  label={translate('crownApp.supplierResource.minOrderQuantity')}
                  rules={[
                    {
                      required: true,
                      message: translate('entity.validation.required'),
                    },
                  ]}
                >
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  name="quantityOnHand"
                  label={translate('crownApp.supplierResource.quantityOnHand')}
                  rules={[
                    {
                      required: true,
                      message: translate('entity.validation.required'),
                    },
                  ]}
                >
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                >

                </Form.Item>

                <Row gutter={[0, 8]}>
                  <Col span={4}>
                    <Form.Item>
                      <Button type="default" htmlType="submit" icon={<ArrowLeftOutlined />}>
                        {translate('entity.action.back')}
                      </Button>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                        <Translate contentKey="entity.action.save">Save</Translate>
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
                <Input type="hidden" name="isSeller" value="true" />
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
  supplierResourceEntity: storeState.supplierResource.entity,
  loading: storeState.supplierResource.loading,
  updating: storeState.supplierResource.updating,
  updateSuccess: storeState.supplierResource.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(SupplierResourceUpdate);
