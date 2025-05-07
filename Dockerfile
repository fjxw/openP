FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5095

ENV ASPNETCORE_URLS=http://+:5095

USER app
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG configuration=Release
WORKDIR /src
COPY ["OpenP/OpenP.csproj", "OpenP/"]
RUN dotnet restore "OpenP/OpenP.csproj"
COPY . .
WORKDIR "/src/OpenP"
RUN dotnet build "OpenP.csproj" -c $configuration -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "OpenP.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "OpenP.dll"]
