interface LogDetailsForFormatting {
    userId?: { _id: string; name?: string; email?: string } | string;
    targetType?: string;
    itemId?: { _id: string; name?: string; sku?: string } | string;
    itemName?: string; // Adicionado: Para acessar o nome do item principal do log
    floorId?: { _id: string; localCode?: string; name?: string } | string;
    stockedItemId?: { _id: string; quantity?: number; type?: string; local?: string; ItemId?: string } | string;
}

export const ACTION_LABELS: { [key: string]: string } = {
    CREATE: "Criação",
    UPDATE: "Atualização",
    DELETE: "Exclusão",
    INACTIVATE: "Inativação",
    REACTIVATE: "Reativação",
    UPDATE_PHOTO: "Atualização de Foto",
    ITEM_INBOUND: "Entrada de Item",
    ITEM_OUTBOUND: "Saída de Item",
    ITEM_TRANSFER: "Transferência de Item",
    ITEM_INITIAL_STOCK: "Estoque Inicial",
    ITEM_ADJUSTMENT: "Ajuste de Estoque",
    ADD_VOUCHER: "Adição de Voucher",
    STATUS_CHANGE: "Mudança de Status",
    PAYMENT_UPDATE: "Atualização de Pagamento",
    ITEM_UPDATE: "Atualização de Itens do Pedido",
    INACTIVATE_HIERARCHY: "Inativação de Hierarquia",
    SELECT: "Seleção (Ativar)",

    TRANSFER_OUT: "Transferência (Saída)",
    TRANSFER_IN_NEW: "Transferência (Nova Entrada)",
    TRANSFER_IN_INCREMENT: "Transferência (Entrada para Existente)",
    STORE_IN_LOCATION: "Estocagem Inicial",
    QUANTITY_INCREMENT: "Quantidade Aumentada (Geral)",
    QUANTITY_DECREASE: "Quantidade Diminuída (Geral)",
    QUANTITY_ADJUSTMENT: "Ajuste Manual de Quantidade",
    QUANTITY_INCREASE: "Aumento Manual de Quantidade",
    NO_QUANTITY_CHANGE: "Sem Mudança de Quantidade",
    CONSOLIDATE_INACTIVATE: "Consolidação (Item Inativado)",
    CONSOLIDATE_UPDATE: "Consolidação (Item Recebeu Qtd.)",
    QUANTITY_DEPLETED: "Quantidade Esgotada",
};

export const FIELD_LABELS: { [key: string]: string } = {
    name: "Nome", email: "E-mail", description: "Descrição", code: "Código", active: "Status (Ativo)",
    timestamp: "Data/Hora", quantity: "Quantidade", price: "Preço", sku: "SKU", upcList: "Códigos de Barras (UPC)",
    ncm: "NCM", color: "Cor", height: "Altura", width: "Largura", depth: "Comprimento", weight: "Peso",
    quantityBox: "Unidades por Caixa", promotionPrice: "Preço de Promoção", wholesalePrice: "Preço de Atacado",
    retailPrice: "Preço de Varejo", taxPrices: "Preços com Imposto", isPromotion: "Em Promoção",
    category: "Categoria", Roles: "Cargos", RolesAdicionado: "Cargo Adicionado", RolesRemovido: "Cargo Removido",
    permissions: "Permissões", permissionsAdicionado: "Permissão Adicionada", permissionsRemovido: "Permissão Removida",
    password: "Senha", telephoneNumber: "Telefone", cpf: "CPF", cnpj: "CNPJ", address: "Endereço",
    'address.street': "Rua", 'address.number': "Número", 'address.neighborhood': "Bairro", 'address.city': "Cidade",
    'address.state': "Estado", 'address.zip': "CEP", 'address.complement': "Complemento", fromLocationName: "Local de Origem",
    toLocationName: "Local de Destino", purchaseId: "ID da Compra", orderId: "ID do Pedido", minWholesaleQuantity: "Quantidade Mínima Atacado",
    retailTaxPercentage: "Porcentagem Varejo", wholesaleTaxPercentage: "Porcentagem Atacado", selected: "Ativo",
    clientName: "Nome do Cliente", voucher: "Voucher", Items: "Lista de Itens do Pedido", ClientId: "Cliente (ID)",
    SellerId: "Vendedor (ID)", totalPrice: "Preço Total", subtotalPrice: "Preço Subtotal", discount: "Desconto",
    local: "Local", status: "Status do Pedido", typeOfDelivery: "Tipo de Entrega", deliveryAddress: "Endereço de Entrega",
    paymentStatus: "Status de Pagamento", dock: "Doca", observation: "Observação", order_creation: "Criação do Pedido",
    orderNumber: "Número do Pedido", totalValue: "Valor Total", itemsCount: "Contagem de Itens", targetModel: "Nível do Alvo",
    stockName: "Nome do Estoque", hierarchy: "Hierarquia", hierarchyLevel: "Nível da Hierarquia", hierarchyDetails: "Detalhes da Hierarquia",
    createdBy: "Criado por", updatedBy: "Atualizado por", supervisorPassword: "Senha de Supervisor", purchases: "Compras",
    itemName: "Nome do Item", 
    stockedItemId: "ID do Item Estocado", 
    itemId: "Item Mestre", // Rótulo amigável para o campo 'itemId'
    floorId: "Andar (Local)", 
    type: "Tipo (Caixa/Unidade)", 
    costPrice: "Preço de Custo", // Rótulo amigável para o campo 'costPrice'
    targetId: "ID do Alvo", 
    targetName: "Nome do Alvo"
};

interface AddressObject {
    street?: string; number?: string; complement?: string;
    neighborhood?: string; city?: string; state?: string; zip?: string;
}

function formatAddressObject(value: unknown): string {
    if (typeof value !== 'object' || value === null) return String(value);
    const addressObj = value as AddressObject;
    const parts: string[] = [];
    if (addressObj.street) parts.push(addressObj.street);
    if (addressObj.number) parts.push(`, ${addressObj.number}`);
    if (addressObj.complement) parts.push(` (${addressObj.complement})`);
    if (addressObj.neighborhood) parts.push(` - ${addressObj.neighborhood}`);
    if (addressObj.city && addressObj.state) parts.push(` (${addressObj.city}/${addressObj.state})`);
    if (addressObj.zip) parts.push(` CEP: ${addressObj.zip}`);
    return parts.join('');
}

function formatPurchasesArray(oldArray: unknown[], newArray: unknown[], fieldLabel: string): string {
    if (newArray.length === 0 && oldArray.length === 0) return `${fieldLabel}: Nenhuma compra registrada.`;
    if (newArray.length > oldArray.length) {
        return `${fieldLabel}: ${newArray.length - oldArray.length} novas compras adicionadas.`;
    }
    if (newArray.length < oldArray.length) {
        return `${fieldLabel}: ${oldArray.length - newArray.length} compras removidas.`;
    }
    if (JSON.stringify(oldArray) !== JSON.stringify(newArray)) {
        return `${fieldLabel}: Conteúdo das compras atualizado.`;
    }
    return `${fieldLabel}: Sem mudanças visíveis nas compras.`;
}

interface VoucherObject {
    code: string;
    value: number;
}

function formatVoucherArray(oldArray: unknown[], newArray: unknown[], fieldLabel: string): string {
    if (newArray.length === 0 && oldArray.length === 0) return `${fieldLabel}: Nenhum voucher.`;
    if (newArray.length > oldArray.length) {
        const addedVouchers = newArray.filter(nv => !oldArray.some(ov => (ov as VoucherObject).code === (nv as VoucherObject).code));
        return `${fieldLabel}: ${addedVouchers.length} novos vouchers adicionados.`;
    } else if (newArray.length < oldArray.length) {
        const removedVouchers = oldArray.filter(ov => !newArray.some(nv => (ov as VoucherObject).code === (nv as VoucherObject).code));
        return `${fieldLabel}: ${removedVouchers.length} vouchers removidos.`;
    } else if (newArray.length > 0) {
        return `${fieldLabel}: Vouchers atualizados.`;
    }
    return `${fieldLabel}: Sem mudanças visíveis nos vouchers.`;
}

const formatBasicValue = (value: unknown, field: string): string => {
    if (value === null || value === undefined) return 'N/A';

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        if ('name' in value && typeof value.name === 'string' && value.name) return value.name;
        if ('code' in value && typeof value.code === 'string' && value.code) return value.code;
        if ('email' in value && typeof value.email === 'string' && value.email) return value.email;
        if ('_id' in value && typeof value._id === 'string' && value._id) {
            const idFieldsToTruncate = ['_id', 'targetId', 'clientId', 'sellerId', 'itemId', 'dock', 'fromLocationId', 'toLocationId', 'category', 'createdBy', 'updatedBy', 'stockedItemId', 'floorId'];
            if (idFieldsToTruncate.includes(field) || field.toLowerCase().endsWith('id')) {
                return `${value._id.substring(0, 8)}...`;
            }
            return value._id;
        }
        return `[Objeto]`;
    }

    if (typeof value === 'string' && value.length === 24 && value.match(/^[0-9a-fA-F]{24}$/)) {
        const idFieldsToTruncate = ['_id', 'targetId', 'clientId', 'sellerId', 'itemId', 'dock', 'fromLocationId', 'toLocationId', 'category', 'createdBy', 'updatedBy', 'stockedItemId', 'floorId'];
        if (idFieldsToTruncate.includes(field) || field.toLowerCase().endsWith('id')) {
            return `${value.substring(0, 8)}...`;
        }
        return value;
    }

    if (typeof value === 'number') {
        if (field.includes('Price') || field.includes('Value') || field === 'totalPrice' || field === 'subtotalPrice' || field === 'discount' || field === 'costPrice') {
            return `R$ ${value.toFixed(2).replace('.', ',')}`;
        }
        if (field.includes('Percentage')) {
            return `${value}%`;
        }
        if (Number.isInteger(value)) {
            return String(value);
        }
    }

    if (typeof value === 'boolean') {
        return value ? 'Sim' : 'Não';
    }

    return String(value);
};

export function formatChange(
    change: { field: string; oldValue?: unknown; newValue?: unknown },
    logDetails?: LogDetailsForFormatting // Usamos o tipo local LogDetailsForFormatting aqui
): string | string[] {
    const fieldLabel = FIELD_LABELS[change.field] || change.field;

    if (change.field === 'password' || change.field === 'supervisorPassword') {
        return `${fieldLabel}: [*****]`;
    }

    if (change.field === 'createdBy' || change.field === 'updatedBy') {
        const resolveUserDisplayName = (val: unknown): string => {
            if (val === null || val === undefined) return 'N/A';

            if (typeof val === 'object' && val !== null && '_id' in val) {
                const userObj = val as { _id: string; name?: string; email?: string };
                return userObj.name || userObj.email || (userObj._id ? userObj._id.substring(0, 8) + '...' : 'N/A');
            }
            if (typeof val === 'string' && val.match(/^[0-9a-fA-F]{24}$/)) {
                if (logDetails?.userId && typeof logDetails.userId === 'object' && logDetails.userId._id === val) {
                    return logDetails.userId.name || logDetails.userId.email || val.substring(0, 8) + '...';
                }
                return val.substring(0, 8) + '...';
            }
            return String(val);
        };

        const oldUserName = resolveUserDisplayName(change.oldValue);
        const newUserName = resolveUserDisplayName(change.newValue);

        if ((change.oldValue === undefined || change.oldValue === null) && (change.newValue !== undefined && change.newValue !== null)) {
            return `${fieldLabel}: ${newUserName}`;
        } else if ((change.newValue === undefined || change.newValue === null) && (change.oldValue !== undefined && change.oldValue !== null)) {
            return `${fieldLabel}: removido (era ${oldUserName})`;
        } else if (oldUserName !== newUserName) {
            return `${fieldLabel}: de ${oldUserName} para ${newUserName}`;
        }
        return `${fieldLabel}: sem mudanças visíveis`;
    }

    if (change.field === 'Criação do Pedido') {
        const getOrderDetailsArray = (info: unknown | undefined): string[] => {
            if (typeof info !== 'object' || info === null) return [`Detalhes: ${String(info ?? 'N/A')}`];
            const orderInfo = info as { status?: string, totalValue?: number, itemsCount?: number, local?: "online" | "presencial", clientName?: string, orderNumber?: string };

            const details: string[] = [];
            details.push(`Status: ${orderInfo.status ? (FIELD_LABELS[orderInfo.status] || orderInfo.status.replace(/_/g, ' ')) : 'N/A'}`);
            details.push(`Valor: ${orderInfo.totalValue !== undefined ? `R$ ${orderInfo.totalValue.toFixed(2).replace('.', ',')}` : 'N/A'}`);
            details.push(`Itens: ${orderInfo.itemsCount !== undefined ? orderInfo.itemsCount : 'N/A'}`);
            details.push(`Local: ${orderInfo.local ? (FIELD_LABELS[orderInfo.local] || orderInfo.local.replace(/_/g, ' ')) : 'N/A'}`);
            details.push(`Cliente: ${orderInfo.clientName || 'N/A'}`);
            details.push(`Número do Pedido: ${orderInfo.orderNumber || 'N/A'}`);

            return details;
        };

        const newOrderDetails = getOrderDetailsArray(change.newValue);

        return [`${fieldLabel}:`, ...newOrderDetails];
    }

    if (logDetails?.targetType === "Client") {
        if (change.field === 'address') {
            const oldValueFormatted = typeof change.oldValue === 'object' && change.oldValue !== null ? formatAddressObject(change.oldValue) : String(change.oldValue ?? 'N/A');
            const newValueFormatted = typeof change.newValue === 'object' && change.newValue !== null ? formatAddressObject(change.newValue) : String(change.newValue ?? 'N/A');

            if (change.oldValue === undefined || change.oldValue === null) {
                return `${fieldLabel}: criado como ${newValueFormatted}`;
            } else if (change.newValue === undefined || change.newValue === null) {
                return `${fieldLabel}: removido (era ${oldValueFormatted})`;
            } else if (oldValueFormatted !== newValueFormatted) {
                return `${fieldLabel}: de ${oldValueFormatted} para ${newValueFormatted}`;
            }
            return `${fieldLabel}: sem mudanças visíveis`;
        }
        if (change.field === 'purchases') {
            return formatPurchasesArray(Array.isArray(change.oldValue) ? change.oldValue : [], Array.isArray(change.newValue) ? change.newValue : [], fieldLabel);
        }
        if (change.field === 'voucher' && (Array.isArray(change.oldValue) || Array.isArray(change.newValue))) {
            return formatVoucherArray(Array.isArray(change.oldValue) ? change.oldValue : [], Array.isArray(change.newValue) ? change.newValue : [], fieldLabel);
        }
    }

    if (Array.isArray(change.oldValue) || Array.isArray(change.newValue)) {
        const oldArray = Array.isArray(change.oldValue) ? change.oldValue : [];
        const newArray = Array.isArray(change.newValue) ? change.newValue : [];

        if (change.field === 'Roles' || change.field === 'permissions') {
            const oldNames = (oldArray as Array<{ name?: string, _id: string }>).map(item => {
                if (!item) return 'N/A';
                return item.name || (item._id ? item._id.substring(0, 8) + '...' : 'N/A');
            }).join(', ');
            const newNames = (newArray as Array<{ name?: string, _id: string }>).map(item => {
                if (!item) return 'N/A';
                return item.name || (item._id ? item._id.substring(0, 8) + '...' : 'N/A');
            }).join(', ');

            if (change.oldValue === undefined || change.newValue === undefined) {
                if (change.oldValue === undefined && change.newValue !== undefined) {
                    return `${fieldLabel}: ${newNames || 'nenhum'}`;
                }
                if (change.newValue === undefined && change.oldValue !== undefined) {
                    return `${fieldLabel}: removido (era ${oldNames || 'nenhum'})`;
                }
            }
            return `${fieldLabel}: de [${oldNames || 'nenhum'}] para [${newNames || 'nenhum'}]`;
        }

        if (oldArray.length !== newArray.length) {
            return `${fieldLabel}: Lista alterada (tamanho de ${oldArray.length} para ${newArray.length})`;
        }
        if (JSON.stringify(oldArray) !== JSON.stringify(newArray)) {
            return `${fieldLabel}: Conteúdo da lista atualizado`;
        }
        return `${fieldLabel}: Sem mudanças visíveis na lista`;
    }

    if (typeof change.oldValue === 'boolean' || typeof change.newValue === 'boolean') {
        const oldValueText = typeof change.oldValue === 'boolean' ? (change.oldValue ? 'Sim' : 'Não') : 'N/A';
        const newValueText = typeof change.newValue === 'boolean' ? (change.newValue ? 'Sim' : 'Não') : 'N/A';

        if (change.oldValue !== undefined && change.newValue !== undefined) {
            return `${fieldLabel}: de "${oldValueText}" para "${newValueText}"`;
        }
        return `${fieldLabel}: definido como "${newValueText}"`;
    }

    if (['status', 'local', 'paymentStatus', 'typeOfDelivery', 'hierarchyLevel', 'targetModel', 'type'].includes(change.field)) {
        const oldText = String(change.oldValue ?? 'N/A').replace(/_/g, ' ');
        const newText = String(change.newValue ?? 'N/A').replace(/_/g, ' ');
        return `${fieldLabel}: de "${oldText}" para "${newText}"`;
    }

    if (change.field === 'hierarchyDetails') {
        const details = change.newValue as { streets?: number; builds?: number; floors?: number };
        return `${fieldLabel}: Ruas: ${details.streets ?? 0}, Prédios: ${details.builds ?? 0}, Andares: ${details.floors ?? 0}`;
    }

    if (change.field === 'itemId') {
        const oldVal = change.oldValue;
        const newVal = change.newValue;

        if (logDetails?.itemName) {
            const oldItemDisplay = String(oldVal || 'N/A').substring(0, 8) + '...'; 
            const newItemDisplay = logDetails.itemName; 

            if ((change.oldValue === undefined || change.oldValue === null) && (change.newValue !== undefined && change.newValue !== null)) {
                return `${FIELD_LABELS.name}: definido como '${newItemDisplay}'`; 
            } else if ((change.newValue === undefined || change.newValue === null) && (change.oldValue !== undefined && change.oldValue !== null)) {
                return `${FIELD_LABELS.name}: removido (era '${oldItemDisplay}')`; 
            }

            if (typeof oldVal === 'string' && typeof newVal === 'string' && oldVal === logDetails?.itemId && newVal === logDetails?.itemId) {
                 return `${FIELD_LABELS.name}: sem mudanças visíveis`; 
            }

            const oldItemPopulatedName = (typeof oldVal === 'object' && oldVal !== null && 'name' in oldVal) ? (oldVal as { name: string }).name : oldItemDisplay;
            const newItemPopulatedName = (typeof newVal === 'object' && newVal !== null && 'name' in newVal) ? (newVal as { name: string }).name : newItemDisplay;

            return `${FIELD_LABELS.name}: de '${oldItemPopulatedName}' para '${newItemPopulatedName}'`;
        }


        const oldDisplay = (typeof oldVal === 'object' && oldVal !== null && '_id' in oldVal)
            ? (oldVal as { name?: string; sku?: string; _id: string }).name || (oldVal as { name?: string; sku?: string; _id: string }).sku || (oldVal as { _id: string })._id.substring(0, 8) + '...'
            : String(oldVal || 'N/A').substring(0, 8) + '...';

        const newDisplay = (typeof newVal === 'object' && newVal !== null && '_id' in newVal)
            ? (newVal as { name?: string; sku?: string; _id: string }).name || (newVal as { name?: string; sku?: string; _id: string }).sku || (newVal as { _id: string })._id.substring(0, 8) + '...'
            : String(newVal || 'N/A').substring(0, 8) + '...';
        
        return `${fieldLabel}: de '${oldDisplay}' para '${newDisplay}'`; 
    }

    if (change.field === 'floorId') {
        const oldVal = change.oldValue;
        const newVal = change.newValue;

        const oldFloorDisplay = (typeof oldVal === 'object' && oldVal !== null && '_id' in oldVal)
            ? (oldVal as { localCode?: string; name?: string; _id: string }).localCode || (oldVal as { localCode?: string; name?: string; _id: string }).name || (oldVal as { _id: string })._id.substring(0, 8) + '...'
            : String(oldVal || 'N/A').substring(0, 8) + '...';

        const newFloorDisplay = (typeof newVal === 'object' && newVal !== null && '_id' in newVal)
            ? (newVal as { localCode?: string; name?: string; _id: string }).localCode || (newVal as { localCode?: string; name?: string; _id: string }).name || (newVal as { _id: string })._id.substring(0, 8) + '...'
            : String(newVal || 'N/A').substring(0, 8) + '...';

        if (change.oldValue === undefined || change.oldValue === null) {
            return `${fieldLabel}: definido como '${newFloorDisplay}'`;
        } else if (change.newValue === undefined || change.newValue === null) {
            return `${fieldLabel}: removido (era '${oldFloorDisplay}')`;
        }
        return `${fieldLabel}: de '${oldFloorDisplay}' para '${newFloorDisplay}'`;
    }

    if (change.field === 'stockedItemId') {
        const oldVal = change.oldValue;
        const newVal = change.newValue;

        const oldStockedDisplay = (typeof oldVal === 'object' && oldVal !== null && '_id' in oldVal) ? (oldVal as { _id: string; local?:string; quantity?:number })._id.substring(0,8) + '...' : String(oldVal || 'N/A');
        const newStockedDisplay = (typeof newVal === 'object' && newVal !== null && '_id' in newVal) ? (newVal as { _id: string; local?:string; quantity?:number })._id.substring(0,8) + '...' : String(newVal || 'N/A');
        
        return `${fieldLabel}: de '${oldStockedDisplay}' para '${newStockedDisplay}'`;
    }

    const isOldValueObject = typeof change.oldValue === 'object' && change.oldValue !== null && !Array.isArray(change.oldValue);
    const isNewValueObject = typeof change.newValue === 'object' && change.newValue !== null && !Array.isArray(change.newValue);

    if (isOldValueObject || isNewValueObject) {
        const formattedOld = isOldValueObject ? formatBasicValue(change.oldValue, change.field) : String(change.oldValue ?? 'N/A');
        const formattedNew = isNewValueObject ? formatBasicValue(change.newValue, change.field) : String(change.newValue ?? 'N/A');

        if (change.oldValue === undefined || change.oldValue === null) {
            return `${fieldLabel}: definido como ${formattedNew}`;
        }
        if (change.newValue === undefined || change.newValue === null) {
            return `${fieldLabel}: removido (era ${formattedOld})`;
        }
        if (formattedOld !== formattedNew) {
            return `${fieldLabel}: de ${formattedOld} para ${formattedNew}`;
        }
        return `${fieldLabel}: sem mudanças visíveis`;
    }

    const formattedOldValue: string = formatBasicValue(change.oldValue, change.field);
    const formattedNewValue: string = formatBasicValue(change.newValue, change.field);

    if ((change.newValue === undefined || change.newValue === null) && (change.oldValue === undefined || change.oldValue === null)) {
        return `${fieldLabel}: Sem mudanças (N/A)`;
    }
    if ((change.oldValue === undefined || change.oldValue === null) && (change.newValue !== undefined && change.newValue !== null)) {
        return `${fieldLabel}: definido como ${formattedNewValue}`;
    }
    if ((change.newValue === undefined || change.newValue === null) && (change.oldValue !== undefined && change.oldValue !== null)) {
        return `${fieldLabel}: removido (era ${formattedOldValue})`;
    }
    return `${fieldLabel}: de ${formattedOldValue} para ${formattedNewValue}`;
}


export function formatChangesList(changes: { field: string; oldValue?: unknown; newValue?: unknown }[], logDetails?: LogDetailsForFormatting): string {
    if (!changes || changes.length === 0) {
        return "Nenhuma mudança detalhada.";
    }
    return changes.map(change => {
        const formatted = formatChange(change, logDetails);
        if (Array.isArray(formatted)) {
            return `${formatted[0]} ${formatted.slice(1).join('; ')}`;
        }
        return formatted;
    }).join('; ');
}

export function formatAction(action: string): string {
    return ACTION_LABELS[action] || action;
}