# Dicionário centralizado de mensagens de erro e alertas (i18n interno)
# Todas as mensagens retornadas pela API devem vir deste arquivo.

class ErrorMessages:
    # Genéricos
    INTERNAL_SERVER_ERROR = "Erro interno do servidor."
    SERVICE_UNAVAILABLE = "Serviço indisponível. Não foi possível conectar ao banco de dados."
    INVALID_DATE_FORMAT = "Formato de data inválido. Utilize YYYY-MM-DD."
    
    # KPIs e Admin
    KPI_NOT_FOUND = "KPI com ID {id} não encontrado."
    KPI_ALREADY_EXISTS = "KPI com o identificador '{slug}' já existe."
    INVALID_JSON_CONFIG = "A configuração JSON enviada não é válida para este KPI."
