FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["OpenP.csproj", "./"]
RUN dotnet restore "OpenP.csproj"
COPY . .
RUN dotnet build "OpenP.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "OpenP.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .


RUN mkdir -p /app/Files/Products && \
    chmod -R 777 /app/Files

ENV ASPNETCORE_URLS=http://+:5000
ENTRYPOINT ["dotnet", "OpenP.dll"]
