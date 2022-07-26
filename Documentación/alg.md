# Idea Para convertir a Siddhi el diagrama JSON:

- Cada Actividad del diagrama será un Stream (De entrada). Los argumentos de este stream serán las propiedades ligadas a este, es decir, si una actvidad tiene 2 propiedades, el Stream tendrá dos argmentos, siendo el nombre de estos el nombre de la propiedad y su tipo el definido para la misma (String, int, date(?)).
    - Para determinar los argumentos, habrá que mirar los índices de los edges (Pensando en idActividad<->idPropiedad)
- Cada recompensa del diagrama conformará un Stream (De salida).
- Cada subestrategia o info vendrá determinada por una recompensa o un Stream de salida.