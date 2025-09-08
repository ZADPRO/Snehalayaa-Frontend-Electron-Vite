export interface Attribute {
  AttributeGroupId: number
  AttributeId: number
  AttributeKey: string
  AttributeValue: string
  CreatedAt: string
  CreatedBy: string
  UpdatedAt: string
  UpdatedBy: string
  attributeGroupName: string
  isDelete: boolean
}

export interface AttributePayload {
  attributeGroupId: number
  attributeValue: string
  attributeKey: string
}

export interface dataType {
  AttributeGroupId: number
  attributeGroupName: string
}
