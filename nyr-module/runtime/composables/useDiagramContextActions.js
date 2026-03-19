export function useDiagramContextActions({cards, connections, onOpen}) {
  function buildDuplicatedPorts(rawPorts, prefix) {
    if (!Array.isArray(rawPorts)) return [];

    return rawPorts.map((port, index) => {
      return {
        ...port,
        id: `${prefix}-${index + 1}`
      };
    });
  }

  function duplicateCard(card) {
    if (!card) return;

    const nextId = Date.now() + Math.floor(Math.random() * 1000);
    const duplicatedCard = {
      ...card,
      id: nextId,
      name: card.name ? `${card.name} (copia)` : "Copia",
      gridCol: typeof card.gridCol === "number" ? card.gridCol + 2 : card.gridCol,
      x: typeof card.x === "number" ? card.x + 40 : card.x,
      inputProducts: Array.isArray(card.inputProducts) ? [...card.inputProducts] : card.inputProducts,
      outputProducts: Array.isArray(card.outputProducts) ? [...card.outputProducts] : card.outputProducts,
      inputs: buildDuplicatedPorts(card.inputs, `in-${nextId}`),
      outputs: buildDuplicatedPorts(card.outputs, `out-${nextId}`)
    };

    cards.value = [...cards.value, duplicatedCard];
  }

  function removeCard(cardId) {
    cards.value = cards.value.filter((card) => {
      return card.id !== cardId;
    });

    connections.value = connections.value.filter((connection) => {
      return connection.from.cardId !== cardId && connection.to.cardId !== cardId;
    });
  }

  function onCardContextAction(payload) {
    if (!payload || !payload.action) return;

    if (payload.action === "open") {
      if (typeof onOpen === "function") {
        onOpen(payload);
      }
      return;
    }

    if (payload.action === "duplicate") {
      duplicateCard(payload.card);
      return;
    }

    if (payload.action === "remove") {
      removeCard(payload.cardId);
    }
  }

  return {
    onCardContextAction
  };
}
