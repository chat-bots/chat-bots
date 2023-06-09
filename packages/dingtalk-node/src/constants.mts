export enum ConversationType {
  Individual = '1',
  Room = '2',
}

export enum MessageType {
  Empty = 'empty',
  Text = 'text',
  Markdown = 'markdown',
  RichText = 'richText',
}

export enum SubscriptionEventType {
  /**
   * URL检查
   *
   * Note: 绑定事件与回调接口会触发一次事件
   */
  CheckURL = 'check_url',
  /**
   * 消息推送
   *
   * Note: 绑定消息推送时会触发一次事件
   */
  Listen = 'Listen',
}

export enum EventType {
  CheckURL = 'check_url',
  Listen = 'Listen',
  ImMessage = 'im.message',
}
